var app = new Vue({
  el: "#editor",
  mounted() {
    this.$nextTick(() => {
      this.preview();
    });
  },

  watch: {
    resolution() {this.generatePreview();},
    fill() {this.generatePreview();},
    title() {this.generatePreview();} },


  methods: {
    getSvg() {
      var svgData = this.$refs.svgElement.outerHTML;
      this.download(svgData, true);
    },

    getPng() {
      var canvas = this.$refs.canvas;
      const dataURL = canvas.toDataURL("image/png");
      this.download(dataURL, false);
    },

    download(dataURL, raw) {
      var iframe = '';
      if (raw) {
        iframe = dataURL;
      } else {
        iframe = `<img src='${dataURL}'>`;
      }

      const anchor = document.createElement('a');
      anchor.setAttribute('download', 'logo');

      if (dataURL.startsWith('<svg')) {
        anchor.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataURL)}`;
      } else {
        anchor.href = dataURL;
      }
      anchor.click();
    },

    generatePreview() {
      this.$nextTick(() => {
        this.preview();
      });
    },

    preview() {
      var svgData = this.$refs.svgElement.outerHTML;
      var svgDoc = new DOMParser().parseFromString(svgData, 'image/svg+xml');
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext("2d");

      var fontToGrab = this.importedFont;

      var vm = this;

      this.GFontToDataURI(fontToGrab).
      then(cssRules => {// we've got our array with all the cssRules
        let svgNS = "http://www.w3.org/2000/svg";
        // so let's append it in our svg node
        let defs = svgDoc.createElementNS(svgNS, 'defs');
        let style = svgDoc.createElementNS(svgNS, 'style');
        style.innerHTML = cssRules.join('\n');
        defs.appendChild(style);
        svgDoc.documentElement.appendChild(defs);
        // now we're good to create our string representation of the svg node
        let str = new XMLSerializer().serializeToString(svgDoc.documentElement);
        // Edge throws when blobURIs load dataURIs from https doc...
        // So we'll use only dataURIs all the way...
        let uri = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(str);

        let img = new Image();
        img.onload = function (e) {
          URL.revokeObjectURL(this.src);
          canvas.width = vm.resolution;
          canvas.height = vm.resolution;
          ctx.drawImage(this, 0, 0);
        };
        img.src = uri;
      }).
      catch(reason => console.log(reason)); // if something went wrong, it'll go here
    },

    GFontToDataURI(url) {
      return fetch(url) // first fecth the embed stylesheet page
      .then(resp => resp.text()) // we only need the text of it
      .then(text => {
        // now we need to parse the CSSruleSets contained
        // but chrome doesn't support styleSheets in DOMParsed docs...
        let s = document.createElement("style");
        s.innerHTML = text;
        document.head.appendChild(s);
        let styleSheet = s.sheet;

        // this will help us to keep track of the rules and the original urls
        let FontRule = rule => {
          let src =
          rule.style.getPropertyValue("src") ||
          rule.style.cssText.match(/url\(.*?\)/g)[0];
          if (!src) return null;
          let url = src.split("url(")[1].split(")")[0];
          return {
            rule: rule,
            src: src,
            url: url.replace(/\"/g, "") };

        };
        let fontRules = [],
        fontProms = [];

        // iterate through all the cssRules of the embedded doc
        // Edge doesn't make CSSRuleList enumerable...
        for (let i = 0; i < styleSheet.cssRules.length; i++) {if (window.CP.shouldStopExecution(0)) break;
          let r = styleSheet.cssRules[i];
          let fR = FontRule(r);
          if (!fR) {
            continue;
          }
          fontRules.push(fR);
          fontProms.push(
          fetch(fR.url) // fetch the actual font-file (.woff)
          .then(resp => resp.blob()).
          then(blob => {
            return new Promise(resolve => {
              // we have to return it as a dataURI
              //   because for whatever reason,
              //   browser are afraid of blobURI in <img> too...
              let f = new FileReader();
              f.onload = e => resolve(f.result);
              f.readAsDataURL(blob);
            });
          }).
          then(dataURL => {
            // now that we have our dataURI version,
            //  we can replace the original URI with it
            //  and we return the full rule's cssText
            return fR.rule.cssText.replace(fR.url, dataURL);
          }));

        }window.CP.exitedLoop(0);
        document.head.removeChild(s); // clean up
        return Promise.all(fontProms); // wait for all this has been done
      });
    } } });
//# sourceURL=pen.js
