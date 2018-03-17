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
### 1-1 select
@Params
  * tableName: string, 
  * columnSelected?: string, 
  * column?: string, 
  * operator?: string, 
  * value?: any, 
  * orderBy?: string
  
@Return : Promise
  
```javascript
this.select({
      tableName: 'person', 
      columnSelected: 'name, birthday', 
      column: 'name', 
      operator: 'like', 
      value: 'a%', 
      orderBy: 'birthday ASC'
    });
```
Equivalent query in SQL
```sql
SELECT name, birthday FROM person WHERE name LIKE 'a%' ORDER BY birthday ASC;
```


### 1-2 selectCustom
@Params
  * tableName: string, 
  * customColumns?: string, default customColumns = '*'
  * custom?: string, 
  * orderBy?: string
  
@Return : Promise
```javascript
this.selectCustom({
      tableName: 'product', 
      customColumns: '*', 
      custom: 'WHERE price > 100', 
      orderBy: 'price DESC, name ASC'
    });
```
Equivalent query in SQL
```sql
SELECT * FROM product WHERE WHERE price > 100 ORDER BY price DESC, name ASC;
```

# 2 Insert

### 2-1 insert
@Params
  * tableName: string, 
  * obj: any,
  * ignore?: string[], 
  
@Return : Promise

```javascript
var myPerson = new Person();

this.insert({tableName: 'person', obj: myPerson});
```

Equivalent query in SQL
```sql
INSERT INTO person 
(firstName, lastName, birthday, birthplace, address, weight, married, nbrChild, job, hasCar) 
VALUES ('Mohamed', 'Ali', '10/03/1959', 'Algeria', 'Algiers', '78', 'Y', '4', 'Officer', 'Y');
```

It's very clear the big difference between DbManager and SQL native

### 2-2 insertIfNotExists
@Params
  * tableName: string, 
  * obj: any,
  * colsRef: string[],
  * colsVal: any[],
  * ignore?: string[], 
  
@Return : Promise

```javascript
var myProduct = new Product();

this.insert({
      tableName: 'product', 
      obj: myProduct, 
      colsRef: ['name', 'constructor'],
      colsVal: ['myProdName', 'myConstructor']
    });
```
Insert my object only if there no one with name = 'myProdName' and constructor = 'myConstructor'

# 3 Update
### 3-1 update
@Params
  * tableName: string, 
  * obj: any,
  * column?: string,
  * operator?: string,
  * value?: any,
  * ignore?: string[], 
  
@Return : Promise

```javascript
var myPerson = new Person();

this.update({
      tableName: 'person', 
      obj: myPerson, 
      column: 'firstName',
      value: 'Mohamed',
      ignore: ['firstName', 'lastName', 'birthday', 'birthplace']
    });
```
Equivalent query in SQL
```sql
UPDATE person
SET address = 'Algiers', weight = 82, married = 'Y', nbrChild = '5', job = 'Director', hasCar = 'N'
WHERE firstName = 'Mohamed'
```
The attributes : 'firstName', 'lastName', 'birthday', 'birthplace' are ignored because we have set them in ignore array

### 3-2 updateOnly

Update only specified attributes.
@Params
  * tableName: string, 
  * columns: string[],
  * values: any[],
  * column?: string,
  * operator?: string,
  * value?: any,
  
@Return : Promise

```javascript
var myPerson = new Person();

this.updateOnly({
      tableName: 'person', 
      columns: ['address', 'weight', 'hasCar'], 
      values: [myPerson.address, myPerson.weight, myPerson.hasCar],
      column: 'firstName',
      operator: '=',
      value: 'Mohamed'
    });
```

Equivalent query in SQL
```sql
UPDATE person
SET address = 'Algiers', weight = 82, hasCar = 'Y'
WHERE firstName = 'Mohamed'
```

### 3-3 updateCustom

Customized update query.
@Params
  * tableName: string, 
  * obj: any,
  * customWhere: string,
  * ignore?: string[],
  
@Return : Promise

```javascript
var myPerson = new Person();
var custom = "WHERE firstName = 'Mohamed' AND lastName='Ali' AND hasCar = 'Y' ";
this.update({
      tableName: 'person', 
      obj: myPerson, 
      customWhere: custom,
      ignore: ['firstName', 'lastName']
    });
```

Equivalent query in SQL
```sql
UPDATE person
SET address = 'Algiers', weight = 82, married = 'Y', nbrChild = '5', job = 'Director', hasCar = 'N'
birthday = '10/03/1959', birthplace = 'Algeria', 
WHERE firstName = 'Mohamed' AND lastName='Ali' AND hasCar = 'Y'
```


# 4 Delete

### 4-1 deleteAll
@Params
  * tableName: string, 
  
@Return : Promise

```javascript
this.deleteAll({tableName: 'product'});
```
Delete all my products in product table without exception

### 4-2 deleteFiltred

@Params
  * tableName: string, 
  * column: string,
  * operator?: string, (optional) default : '='
  * value: any,
  
@Return : Promise

```javascript
this.deleteFiltred({
      tableName: 'product', 
      column: 'price', 
      operator: '<', 
      value: 125
    });
```
Equivalent query in SQL
```sql
DELETE FROM product WHERE price < 125;
```
### 4-3 deleteCustom
@Params
  * tableName: string, 
  * custom: string,
  
@Return : Promise
```javascript
var custom = "WHERE price < 125 AND name like 'a%'";
this.deleteCustom({tableName: 'product', custom: custom});
```
Equivalent query in SQL
```sql
DELETE FROM product WHERE price < 125 AND name like 'a%';
```

# How to install ?
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

