# Node-BE-ABG
BE-NNM Hệ thống cổng thanh toán điện tử

## 1. API
##### 1. /Login
Google authentication

response: 
> success: 
``` 
status = 200
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
##### 2. /update-m-pass
method: PUT <br>
body: {
  "mpass": "000000" //mpass có kích thước tối đa là 6 ký tự
}


