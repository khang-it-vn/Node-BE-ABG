# Node-BE-ABG
BE-NNM Hệ thống cổng thanh toán điện tử

## 1. API
##### 1. /Login
Google authentication

response: 
> success: 
``` 
statusCode = 200
[
  {
    success: true,
    message: "Login success"
  },
  {
    token: "<value>"
  }
]
```
> fail
```
statusCode = 401
```
##### 2. /update-m-pass
method: PUT <br>
headers: {
            Authorizaton: `Bearer token`
          }
body: {
        "mpass": "000000" //mpass có kích thước tối đa là 6 ký tự
      }
>success:

```
statusCode = 200
{
  message: "Update mpass success",
  success: true
}

```
>fail:

```
statusCode = 304
{
  message: "Update mpass false, length of mpass is only 6 character",
  success: false
}
```



