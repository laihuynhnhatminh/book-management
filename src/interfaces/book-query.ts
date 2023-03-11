export interface IBookQuery {
  [key: string]: string | boolean | LowerCaseMongoQuery;
}

interface LowerCaseMongoQuery {
  $regex: string;
  $options: string;
}
