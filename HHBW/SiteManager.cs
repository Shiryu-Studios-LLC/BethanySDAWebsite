using System.Security.Cryptography.X509Certificates;

namespace HHBW
{
    public class SiteManager
    {
        private static bool _SiteInfoWasModified { get; set; }
        public Utils GetUtils { get; private set; }
        public SiteInfo GetInfo { get; private set; }


        public SiteManager(Utils utils)
        {
            GetUtils = utils;
        }

        /// <summary>
        /// Load Siteinfo from file 
        /// </summary>
        /// <returns>SiteInfo object if the file exist</returns>
        public async Task GetSiteInfoAsync()
        {
            var _SiteInfo = await GetUtils.LoadSiteInfoAsync();
            if (_SiteInfo != null)
                GetInfo = _SiteInfo;
        }
    }
}