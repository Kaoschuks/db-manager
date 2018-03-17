# DB-manager
Manage your SQLite database easily

# Utils functions

* initDB : initi database.
* openDB : open database.
* createTables : create tables.
* patch : update tables (ALTER ...).

# Available functions
NB : The symbol '?' means : Optional param
# 1 Select
#### 1-1 select
@Params
  * tableName: string, 
  * columnSelected?: string, 
  * column?: string, 
  * operator?: string, 
  * value?: any, 
  * orderBy?: string
  
@Return : Promise
  
```javascript
this.select({tableName: 'person', columnSelected: 'name, birthday', column: 'name', operator: 'like', value: 'a%', orderBy: 'birthday ASC'});
```
Similar query in SQL
```sql
SELECT name, birthday FROM person WHERE name LIKE 'a%' ORDER BY birthday ASC;
```


#### 1-2 selectCustom
@Params
  * tableName: string, 
  * customColumns?: string, default customColumns = '*'
  * custom?: string, 
  * orderBy?: string
  
@Return : Promise
```javascript
this.selectCustom({tableName: 'product', customColumns: '*', custom: 'WHERE price > 100', orderBy: 'price DESC, name ASC'});
```
Similar query in SQL
```sql
SELECT * FROM product WHERE WHERE price > 100 ORDER BY price DESC, name ASC;
```

# 2 Insert

# 3 Update

# 4 Delete

# How to use ?
## Ionic 2 project

1- Go in your project Ionic 2

```shell
/your-project/src/providers/db/
```

2- Clone the db-manager in your db file
```shell
git clone https://github.com/yajuve/db-manager.git
```

3- Import DbProvider module
in
/your-project/src/app/app.module.ts
add 

```javascript
 ...
  providers: [
    ...
    DbProvider
    ...
  ]
})
export class AppModule {}
```

