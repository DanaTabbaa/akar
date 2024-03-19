export class ResponseResult<T>{
    success!:boolean;
    message!:string;
    data!:T;
}