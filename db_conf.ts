import { Injectable } from '@angular/core';

@Injectable()
export class DbConf {

  protected _db: any;
  protected _win: any = window;
  protected _db_name: string = 'my_db';
  protected _debug: boolean = false;

  constructor() {
    this.initDB();
  }

  initDB(): void {
    this.openDB();
    this.createTables();
    this.patch();
  }


  openDB(): void {
    this._db = this._win.openDatabase(this._db_name, '1.0', 'database', 5 * 1024 * 1024);
  }


  patch(): void {
    var valueArray = [];
    var sqlCreate = {
      // "KEY_Path": 'query 1',
      // "KEY_Path 2": 'query 2'
      // ...
    };
    this._db.transaction(function (tx) {
      for (let key in sqlCreate) {
        tx.executeSql(sqlCreate[key], valueArray, function (tx, result) {
          //console.log(result);
        }, function (tx, error) {
          console.error(error);
        });
      }
    });
  } // patch


  createTables(): void {
    var valueArray = [];
    var sqlCreate = {
      "KEY": 'CREATE TABLE IF NOT EXISTS name_table  (' +
      ' id           INTEGER  NOT NULL PRIMARY KEY UNIQUE,' +
      ' name         VARCHAR(100) NOT NULL'+
      ')',

      "KEY2": 'CREATE TABLE IF NOT EXISTS name_table_2 (' +
      ' id    INTEGER NOT NULL PRIMARY KEY UNIQUE,' +
      ' name          VARCHAR(100) NOT NULL,' +
      ')'
    };
    this._db.transaction(function (tx) {
      for (let key in sqlCreate) {
        tx.executeSql(sqlCreate[key], valueArray, function (tx, result) {
          //console.log(result);
        }, function (tx, error) {
          console.error(error);
        });
      }
    });
  } // createTables


  get db():any {
    return this._db;
  }

  set db(value:any) {
    this._db = value;
  }

}
