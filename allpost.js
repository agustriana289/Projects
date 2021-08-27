var startIndex = 1;
var maxResults = 100;

function sendQuery12()
{
   var scpt = document.createElement("script");
   scpt.src = "/feeds/posts/summary?alt=json&callback=processPostList12&start-index=" + startIndex + "&max-results=" + maxResults;

   document.body.appendChild(scpt);
}

function processPostList12(root)
{
   var elmt = document.getElementById("postList12");
   if (!elmt)
      return;

   var feed = root.feed;

   if (feed.entry.length > 0)
   {
      for (var i = 0; i < feed.entry.length; i++)
      {
         var entry = feed.entry[i];

         var title = entry.title.$t;

         for (var j = 0; j < entry.link.length; j++)
         {
            if (entry.link[j].rel == "alternate")
            {
               var url = entry.link[j].href;

               if (url && url.length > 0 && title && title.length > 0)
               {
                  var d1E = document.createElement("div");
                  var d1E = setAttribute("class", "case-item box box__second");
                  var d2E = document.createElement("div");
                  var d3E = document.createElement("h3");
                  var d3E = setAttribute("class", "title title--h5");
                  
                  var a1E = document.createElement("a");
                  a1E.href = url;
                  a1E.textContent = title;

                  d1e.appendChild(d2e, d32, a1e);
                  elmt.appendChild(d3e, d2e, d1e);
               }

               break;
            }
         }
      }

      if (feed.entry.length >= maxResults)
      {
         startIndex += maxResults;
         sendQuery12();
      }
   }
}

sendQuery12();
