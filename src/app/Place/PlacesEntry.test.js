const expect = require("expect");
const { PlacesEntry } = require("./PlacesEntry");

describe("PlacesEntry", () => {
  it("renders entry without crashing", () => {
    /** @type {any} */
    const panelService = {
      getActiveTab: () => 0,
    };

    const place = {
      canUnmount: false,
      filesystemFree: 0,
      filesystemSize: 0,
      icon: "computer",
      iconType: "ICON_NAME",
      name: "/",
      rootUri: "file:///",
      uuid: "",
    };

    /** @type {any} */
    const placeService = {
      getActive: () => place,

      shortNames: {
        "/": "/",
        "Music": "M",
      },
    };

    new PlacesEntry({
      panelId: 0,
      panelService,
      place,
      placeService,
    }).render();

    new PlacesEntry({
      panelId: 0,
      panelService,
      place: {
        canUnmount: true,
        filesystemFree: 0,
        filesystemSize: 0,
        icon: "media-optical",
        iconType: "ICON_NAME",
        name: "Music",
        rootUri: "file:///media/Music",
        uuid: "",
      },
      placeService,
    }).render();
  });
});
