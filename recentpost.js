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
                  var liE = document.createElement('li');
                  liE.setAttribute('class', "list-group-item border-0");

                  var a1E = document.createElement("a");
                  a1E.href = url;
                  a1E.alt = title;
                  a1E.textContent = title;

                  liE.appendChild(a1E);
                  elmt.appendChild(liE);
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
