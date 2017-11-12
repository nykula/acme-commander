const Gdk = imports.gi.Gdk;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const { ActionService } = require("./Action/ActionService");
const { DialogService } = require("./Dialog/DialogService");
const { FileService } = require("./File/FileService");
const { GioService } = require("./Gio/GioService");
const { WorkerService } = require("./Gio/WorkerService");
const { LogService } = require("./Log/LogService");
const { PlaceService } = require("./Mount/PlaceService");
const Refstore = require("./Refstore/Refstore").default;
const { PanelService } = require("./Panel/PanelService");
const { TabService } = require("./Tab/TabService");

/**
 * @param {any} win
 */
function Services(win) {
  this.win = win;

  this.dialogService = new DialogService(Gtk, this.win);
  this.gioService = new GioService(Gio, Gtk);
  this.logService = new LogService();
  this.placeService = new PlaceService();
  this.refstore = new Refstore();
  this.tabService = new TabService();
  this.workerService = new WorkerService();

  this.panelService = new PanelService(this.tabService);

  this.actionService = new ActionService(
    this.dialogService,
    Gdk,
    this.gioService,
    Gtk,
    this.logService,
    this.placeService,
    this.panelService,
    this.refstore,
    this.tabService,
    this.win,
    this.workerService,
  );

  this.fileService = new FileService(this.panelService, this.tabService);
}

exports.Services = Services;
