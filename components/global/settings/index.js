const settings = {
  updateInterval: 10000,
  query_limit: 1000,
  query_offset: 0,
  rolling_average: 5,
  temperature_units: 'metric',
  logos: {
    veridianLogo: 'veridianLogo.png',
    elexiconLogo: 'elexiconLogo.png',
    alectraLogo: 'alectraLogo.png',
    logo: 'hyperionlogo.png',
  },
  styles: {
    navBar: {
      width: '100%',
      bottomMargin: '0px',
    },
    headerDefault: {
      background: 'linear-gradient(#001868, #00032a)',
      bottomMargin: '0px',
    },
    menuContainer: {
      alignSelf: 'start',
      margin: '50px',
      width: '200px',
    },
    cardContainer: {
      margin: '25px',
      maxWidth: '700px',
    },
    viewerContainer: {
      margin: '25px',
    },
  },
  icons: {
    banner: 'banner.png',
    home: 'homeIcon.png',
    three_d_view: 'monitorSensorIcon.png',
    monitorSelected: 'monitorSelectedIcon.png',
    analytics: 'twoDData.png',
    synchronize: 'synchronizeIcon.png',
    export: 'exportDataIcon.png',
    settings: 'settingsIcon.png',
    search: 'searchIcon.png',
    shutdown: 'shutdownIcon.png',
  },
  viewerParams: {
    widthPercent: '0.55',
    bottomMargin: '250',
  },
  analytics: {
    fontsize: 16,
  },
  Tmax: 100,
  temperature_range: {
    min: -30,
    max: 120,
    warning: 40,
  },
  temperature_range_C: {
    min: -30,
    max: 120,
    warning: 40,
  },
  temperature_range_F: {
    min: -30,
    max: 250,
    warning: 100,
  },
  plotConfig: { staticPlot: false, displayModeBar: false, responsive: true },

  // LOAD MODELS FROM LOCAL MACHINE OR FROM THE INTERNET
  // CHANGE modelsFromWeb to true IF YOU WANT TO LOAD FROM THE INTERNET
  modelsFromWeb: true,
  modelURLsWeb: `https://hyperionhelios.s3.us-east-2.amazonaws.com/models`,
  modelURLsLocal: `./models`,
};

export default settings;
