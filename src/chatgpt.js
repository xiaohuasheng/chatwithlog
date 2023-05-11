import axios from 'axios';

export function getParseCode(message) {
    let param = {'content': message}
    axios.post('http://task.xiaohuasheng.cc/api/chatgpt', param).then(data => {
        if (data.data.data) {
            console.log(data.data.data)
        } else {
            console.log('请求失败，如果重试多次都不行，可能被限制了，可以明天再来')
        }
    }).catch(function (error) {
        // 请求失败处理
        console.log(error)
    })
}
