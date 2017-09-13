import $ from 'jquery';

function ajax(option) {
  ajax.baseUrl="http://192.168.0.123:8080/srm/";
  option.url = (ajax.baseUrl || '') + option.url;
  function GetQueryString(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURI(r[2]);return null;
  }
  let tiket=GetQueryString("tiket");
  if(tiket!=null&&tiket.length==16){
    if(option.url.indexOf('?')==-1&&option.url.indexOf('=')==-1){
      option.url=option.url+'?tiket='+tiket
    }else {
      option.url=option.url+'&tiket='+tiket
    }
  }
  $.ajaxSetup({
    complete:function(XMLHttpRequest){
      let sessionstatus = XMLHttpRequest.getResponseHeader("SESSIONSTATUS");
      if (sessionstatus == "TIMEOUT") {
        let win = window;
        while (win != win.top){
          win = win.top;
        }
        win.location.href= XMLHttpRequest.getResponseHeader("LOGINURL");
      }
    }
  });
  $.ajax({
    url:option.url,
    type:option.type,
    data:JSON.stringify(option.data),
    dataType:'json',
    contentType:'application/json;charset=utf-8',
    success:option.success,
    error:option.error,
  });
}
export default ajax;
