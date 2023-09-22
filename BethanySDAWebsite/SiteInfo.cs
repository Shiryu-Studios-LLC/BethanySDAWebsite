using Microsoft.JSInterop;

namespace BethanySDAWebsite
{
    public class SiteInfo
    {

        [JSInvokable]
        public static string GetTitle()
        {
            var title = "Dummy Title";

            return title;
        }
    }
}
