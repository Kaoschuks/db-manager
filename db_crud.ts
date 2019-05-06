import { Injectable } from '@angular/core';
import { DbConf } from './db_conf';

@Injectable()
export class DbCrud extends DbConf{

  constructor() {
    super();
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

    if(this._debug) console.log('query selectFiltred : ',query);

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

    if(this._debug) console.log('query selectFiltred : ',query);
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
   * Generic select query
   * @param query
   * @param params
   * @returns {Promise<T>}
   */
  selectQuery(query: string, params: any[] = []): Promise<any> {

    if (this._debug) console.log('query selectQuery : ', query);

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
  }// selectQuery


  /***************************** INSERT *******************************/

  /**
   *
   * @param p.tableName: name of table
   * @param p.obj: object
   * @param p.ignore: list attributes of object to ignore
   * @returns {Promise<T>}
   */
  insert(p: {tableName: string, obj: any, ignore?: string[]}) {
    if(p.ignore == undefined)
      p.ignore = [];

    var query = " INSERT INTO " + p.tableName;
    var fields = ' (';
    var values = ' (';
    var params = [];
    let i = 1;
    for (const field in p.obj) {
      if(!this.contains(p.ignore, field)){
        if (i++ == 1) {
          fields += "" + field;
          values += "?";
        }else{
          fields += ", " + field;
          values += ", ?";
        }
        params.push(p.obj[field]);
      }
    }
    fields += ')';
    values += ')';
    query += fields + ' VALUES' + values;
    if(this._debug) console.log('query: ', query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data)
        }, (tx, err) => {
          reject(err)
        });//executeSql
      });//transaction
    });//promise
  }// insert



  /**
   *
   * @param p.tableName: name of table
   * @param p.obj: object
   * @param p.colsRef: names of columns to verify if not exists
   * @param p.colsVal: values of columns to verify if not exists
   * @param p.ignore: list attributes of object to ignore
   * @returns {Promise<T>}
   */
  insertIfNotExists(p: {tableName: string, obj: any, colsRef: string[], colsVal: any[], ignore?: string[]}) {
    if(p.ignore == undefined)
      p.ignore = [];

    var query = " INSERT INTO " + p.tableName;
    var fields = ' (';
    var values = ' SELECT ';
    var where = ' ';
    var params = [];
    let i = 1;
    for (const field in p.obj) {
      if(!this.contains(p.ignore, field)){
        if (i++ == 1) {
          fields += "" + field;
          values += "?";
        }else{
          fields += ", " + field;
          values += ", ?";
        }
        params.push(p.obj[field]);
      }
    }
    fields += ')';
    values += ' ';
    where += 'WHERE NOT EXISTS (SELECT 1 FROM ' + p.tableName + ' WHERE ';
    let j = 0;
    for (j = 0; j < (p.colsRef.length - 1); j++) {
      if(p.colsVal[j] == null) where +=  p.colsRef[j] +' is ? AND ';
      else where +=  p.colsRef[j] +' = ? AND ';
      params.push(p.colsVal[j]);
    }

    if(p.colsVal[j] == null) where += p.colsRef[j] +' is ?)';
    else where += p.colsRef[j] +' = ?)';
    params.push(p.colsVal[j]);
    query += fields + values + where;

    if(this._debug) console.log('query insertIfNotExists : ', query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data)
        }, (tx, err) => {
          reject(err)
        });//executeSql
      });//transaction
    });//promise
  }// insertIfNotExists


  /***************************** UPDATE *******************************/

  /**
   *
   * @param p.tableName: name of table
   * @param p.obj: object
   * @param p.column: name of column
   * @param p.operator: operator to use '=', '!=', '<', '<=' ...
   * @param p.value: value to compare
   * @param p.ignore: list attributes of object to ignore
   * @returns {Promise<T>}
   */
  update(p:{tableName: string, obj: any, column?: string, operator?: string, value?: any, ignore?: string[]}) {

    if(p.ignore == undefined)
      p.ignore = [];
    if(p.operator == undefined)
      p.operator = ' = ';

    var query = " UPDATE " + p.tableName + " SET ";
    var fields = ' ';
    var params = [];
    var where = ' WHERE ';
    let i = 1;
    for (const field in p.obj) {
      if(!this.contains(p.ignore, field)){
        if (i++ == 1) {
          fields += "" + field + " = ? ";
        }else{
          fields += ", " + field + " = ? ";
        }
        params.push(p.obj[field]);
      }
    }
    fields += '';
    if(p.column != undefined && p.value != undefined){
      where += ' ' + p.column + ' ' + p.operator + ' ' + p.value;
    }
    query += fields + ' ' + where;
    if(this._debug) console.log('query update : ', query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data)
        }, function (tx, error) {
          reject(error)
        });//executeSql
      });//transaction
    });//promise

  }// update

  /**
   *
   * @param p.tableName: name of table
   * @param p.obj: object
   * @param p.column: name of column
   * @param p.operator: operator to use '=', '!=', '<', '<=' ...
   * @param p.value: value to compare
   * @param p.ignore: list attributes of object to ignore
   * @returns {Promise<T>}
   */
  updateOnly(p:{tableName: string, columns: string[], values: any[], column?: string, operator?: string, value?: any }) {

    if(p.operator == undefined)
      p.operator = ' = ';

    var query = " UPDATE " + p.tableName + " SET ";
    var fields = ' ';
    var params = [];
    var where = '';
    let i = 1;
    for (const key in p.columns) {

      if (i++ == 1) {
        fields += "" + p.columns[key] + " = ? ";
      }else{
        fields += ", " + p.columns[key] + " = ? ";
      }
      params.push(p.values[key]);

    }
    fields += '';
    if(p.column != undefined && p.value != undefined){
      where += ' WHERE ' + p.column + ' ' + p.operator + ' ' + p.value;
    }
    query += fields + ' ' + where;
    if(this._debug) console.log('query update only : ', query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data)
        }, function (tx, error) {
          reject(error)
        });//executeSql
      });//transaction
    });//promise

  }// updateOnly

  /**
   *
   * @param p.tableName: name of table
   * @param p.obj: object
   * @param p.customWhere: custom query where
   * @param p.ignore: list attributes of object to ignore
   * @returns {Promise<T>}
   */
  updateCustom(p:{tableName: string, obj: any, customWhere: string, ignore?: string[]}) {

    if(p.ignore == undefined)
      p.ignore = [];
    var query = " UPDATE " + p.tableName + " SET ";
    var fields = ' ';
    var params = [];
    let i = 1;
    for (const field in p.obj) {
      if(!this.contains(p.ignore, field)){
        if (i++ == 1) {
          fields += "" + field + " ? ";
        }else{
          fields += ", " + field + " ? ";
        }
        params.push(p.obj[field]);
      }
    }
    fields += '';

    query += fields + ' ' + p.customWhere;
    if(this._debug) console.log('query updateCustom : ', query);

    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, params, function (tx, data) {
          resolve(data)
        }, function (tx, error) {
          reject(error)
        });//executeSql
      });//transaction
    });//promise

  }// updateCustom


  /***************************** DELETE *******************************/

  /**
   *
   * @param p.tableName: name of table
   * @returns {Promise<T>}
   */
  deleteAll(p: {tableName: string}) {

    var query = "DELETE FROM " + p.tableName;
    if(this._debug) console.log('query deleteAll : ',query);
    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, data) {
          resolve(data)
        }, (tx, err) => {
          reject(err)
        });//executeSql
      });//transaction
    });//promise
  }// deletAll

  /**
   *
   * @param p.tableName: name of table
   * @param p.custom: filter column
   * @param p.operator: operator to use '=', '!=', '<', '<=' ...
   * @param p.value: value to compare
   * @returns {Promise<T>}
   */
  deleteFiltred(p: {tableName: string, column: string, operator?: string, value: any}) {
    if(p.operator == undefined)
      p.operator = ' = ';
    var query = "DELETE FROM " + p.tableName +
      " WHERE "+ p.column + " " + p.operator + " ?";

    if(this._debug) console.log('query delete Filtred : ',query);
    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, [p.value], function (tx, data) {
          resolve(data)
        }, (tx, err) => {
          reject(err)
        });//executeSql
      });//transaction
    });//promise
  }// deleteFiltred


  /**
   *
   * @param p.tableName: name of table
   * @param p.custom: custom clause where
   * @returns {Promise<T>}
   */
  deleteCustom(p: {tableName: string, custom: string}) {

    var query = "DELETE FROM " + p.tableName + " " + p.custom;
    if(this._debug) console.log('query deleteCustom : ',query);
    return new Promise((resolve, reject) => {
      this._db.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, data) {
          resolve(data)
        }, (tx, err) => {
          reject(err)
        });//executeSql
      });//transaction
    });//promise
  }// deleteCustom


  /***************************** OTHERS *******************************/
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
  private contains(array, elem): boolean {
    return (array.indexOf(elem) > -1);
  }

}
