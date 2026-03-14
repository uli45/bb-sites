/* @meta
{
  "name": "xiaohongshu/me",
  "description": "获取当前小红书登录用户信息",
  "domain": "www.xiaohongshu.com",
  "args": {},
  "capabilities": ["network"],
  "readOnly": true
}
*/

async function(args) {
  // 小红书使用 XMLHttpRequest wrapper 自动添加 X-s 签名
  // 必须用 XHR 而非 fetch，才能继承页面的签名逻辑
  function xhsFetch(url, method, body) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || 'GET', url, true);
      xhr.withCredentials = true;
      xhr.onload = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({error: 'parse error'}); } };
      xhr.onerror = () => reject(new Error('XHR failed'));
      if (body) { xhr.setRequestHeader('Content-Type', 'application/json'); xhr.send(JSON.stringify(body)); }
      else { xhr.send(); }
    });
  }

  const d = await xhsFetch('https://edith.xiaohongshu.com/api/sns/web/v2/user/me');
  if (!d.success) return {error: 'API error: ' + (d.msg || d.code), hint: 'Not logged into xiaohongshu.com?'};
  const u = d.data;
  return {
    nickname: u.nickname,
    red_id: u.red_id,
    desc: u.desc,
    gender: u.gender,
    userid: u.userid,
    fstatus: u.fstatus
  };
}
