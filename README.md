## Project Structure
There are 3 main modules in this project. However, app module is only boilerplate code. The modules that I'd like to 
highlight are `auth` and `user` modules:
- `auth` - module for authentication and authorization
- `user` - module for user CRUD operations

### Auth module
This module is responsible for authentication and authorization. It uses JWT for authentication.

- `auth.controller.ts` - endpoint for login `(POST /auth/login/)`.
- `auth.service.ts` - logic for login and JWT generation.
- `auth_dto.ts` - DTO for login and JWT generation.
- `auth.entity.ts` - return response that contains the JWT token.
- `auth.module.ts` - defines the auth module.
- `auth.service.ts` - logic for login and JWT generation.

### User module
This module is responsible for user CRUD operation.

- `user.controller.ts` - endpoints for user CRUD operations. There are 5 in total, will be in explained below
- `user.service.ts` - logic for user CRUD operations.
- `user.dto.ts` - DTO for user creation and update.
- `user.module.ts` - defines the user module.

## APIs
For a more detailed information regarding the API contracts, please refer to this [Docs](https://docs.google.com/document/d/1LaubDj0Z_GmyfC2yw5vgKtbYZ39E1QMSVrj07jVII6k/edit?usp=sharing).

## Additional Features
### Validation and Error Handling
- Validation is done using DTOs. DTOs are defined in the `dto` folder of each module.
- APIs that require checking a user's existence such as delete, update, and get by id, will return a 400 Bad Request exception with a descriptive message.
- Check to see if the data types passed in the body, params, or queries are correct.
- If user is not logged in or does not provide a token, a 401 Unauthorized exception will be thrown.

### Pagination and Filtering for GET /users
This is done through the query parameters in the API. The following query parameters are supported:
- `skip` - number of records to skip
- `take` - number of records to take
- `userType` - filter by user type
- `orderBy` - order by a specific field.
- `order` - order by ascending or descending.
More information can be seen in the [API Contract](https://docs.google.com/document/d/1LaubDj0Z_GmyfC2yw5vgKtbYZ39E1QMSVrj07jVII6k/edit?usp=sharing).

### Authentication and Authorization
- Authentication is done through the `/auth/login` endpoint. It will return a JWT token that will be used for authorization.
- Authorization is done through the `AuthGuard` class. It will check if the user is logged in.
- Passwords in the database are hashed using bcrypt.

### Money Collected for Supplier Pseudocode
Let's assume that the `User` model has a new attribute `balance` that is of type float. This attribute will be used to store 
the balance of the user. 

```prisma
model User {
  id        Int       @default(autoincrement()) @id
  name      String    @unique
  userType  UserType  @default(SUPPLIER)
  createdAt DateTime  @default(now())
  password  String
  balance   Float     @default(0)
}
```

The `balance` attribute will be updated every time a user pays for an order. For example, after
a supplier successfully delivers an order.

I like to keep things simple, so there won't be a new API if we want to check a user's balance. Simply, call the 
`GET /users/:id` endpoint and it will return all the previous info + the user's balance. Because of this, we don't need
to think about changing the service and API contract.

On the other hand, if we want to add a transaction between a supplier and a customer, we can create a new model called
`Transaction`. This model will have the following attributes:
```prisma
model Transaction {
  id        Int       @default(autoincrement()) @id
  createdAt DateTime  @default(now())
  amount    Float
  from      User      @relation("FromUser")
  to        User      @relation("ToUser")
}
```

As a result, we can define a new API to create a transaction between a supplier and a retailer. This API will be called
when a retailer pays for an order. The API will be `POST /transactions`. The body will contain the `from` and `to` user,
as well as the amount of money `(balance)` to be transferred.

Writing the service pseudocode, it will look something like this:
```typescript
async createTransction(from, to, amount) {
//   Check if the user has enough balance
//   If not, throw error Insufficient balance
  if (from.balance < amount) {
    throw new BadRequestException('Insufficient balance');
  }
  
//   Create the transaction object
  const transaction = await this.transactionService.create({data})
  
}

// Then update the balance

await this.userService.update({
  where: {
    id: from.id,
  },
  data: {
    balance: from.balance - amount,
  },
});

await this.userService.update({
  where: {
    id: to.id,
  },
  data: {
    balance: to.balance + amount,
  },
});
```

## Setup
Create a PostgreSQL database with the name `user-management-system`.
- username: postgres
- password: password
- host: localhost
- port: 5432
- database: user-management-system

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
