import { Injectable } from '@angular/core';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

  private _db: any;
  private _win: any = window;
  private _db_name: string = 'my_db';

  constructor() {
    console.log('Hello DbProvider Provider');
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


  /***************************** SELECT *******************************/

  /**
   *
   * @param p.tableName: name of table
   * @param p.columnSelected: list column to select
   * @param p.column: name of column
   * @param p.operator: operator to use '=', '!=', '<', '<=' ...
   * @param p.value: value to compare
   * @param p.orderBy: order by
   * @returns {Promise<T>}
   */
  select(p: {tableName: string, columnSelected?: string, column?: string, operator?: string, value?: any, orderBy?: string}) {
    var params = [];
    if(p.columnSelected == undefined)
      p.columnSelected = '*';
    if(p.operator == undefined)
      p.operator = '=';
    var query = "SELECT " + p.columnSelected + " FROM " + p.tableName + " ";
    if(p.column != undefined && p.value != undefined) {
      query += " WHERE " + p.column + " " + p.operator + " ? ";
      params.push(p.value);
    }

    if(p.orderBy != undefined)
      query += ' ORDER BY ' + p.orderBy;

    console.log('query selectFiltred : ',query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          let item: Object;
          let res: Object[] = [];

          for (var i = 0; i < data.rows.length; i++) {
            item = data.rows.item(i);
            res.push(item);
          }

          resolve(res);
        }, function (tx, error) {
          reject(error);
        });
      });
    });
  }// select


  /**
   *
   * @param p.tableName: name of table
   * @param p.customColumns: list of columns to select
   * @param p.custom: custom clause
   * @param p.orderBy: order by
   * @returns {Promise<T>}
   */
  selectCustom(p: {tableName: string, customColumns?: string, custom?: string, orderBy?: string}) {

    if(p.customColumns == undefined)
      p.customColumns = '*';
    if(p.custom == undefined)
      p.custom = '';
    var query = "SELECT " +p.customColumns+ " FROM " + p.tableName + " " + p.custom;
    if(p.orderBy != undefined)
      query += ' ORDER BY ' + p.orderBy;

    console.log('query selectFiltred : ',query);
    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, data) {
          let item: Object;
          let res: Object[] = [];

          for (var i = 0; i < data.rows.length; i++) {
            item = data.rows.item(i);
            res.push(item);
          }

          resolve(res);
        }, function (tx, error) {
          reject(error);
        });
      });
    });
  }// selectCustom


  /**
   * Generic function to execute any query
   * @param query
   * @param params
   * @returns {Promise<T>}
   */
  query(query: string, params: any[] = []) {

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data);
        }, (tx, err) => {
          reject(err);
        });
      }); // transaction
    }); // promise
  } // query

  /**
   *
   * @param array
   * @param elem
   * @returns {boolean}
   */
  contains(array, elem): boolean {
    return (array.indexOf(elem) > -1);
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
