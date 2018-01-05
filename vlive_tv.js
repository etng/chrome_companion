function poll(fn, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done!
        var result = fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
}

function delegate(parent, selector, event, handler){
    if(!parent){
        console.log('no parent, can not bind event to selector', selector)
        return false;
    }
    parent.addEventListener(event, function(e) {
        for (var target=e.target; target && target!=this; target=target.parentNode) {
        // loop parent nodes from the target to the delegation node
            if (target.matches(selector)) {
                handler.call(target, e);
                break;
            }
        }
    }, false);
}
function isUrl(s){
    return /https?:\/\/[a-zA-z0-9]+(\.[a-zA-z0-9]+){1,}\/.+/g.test(s)
}

var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement('style');

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute('media', 'screen')
    // style.setAttribute('media', 'only screen and (max-width : 1024px)')

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style.sheet;
})();


var parseCssRules= function(s){
    var pt=/\s*([^{]*\{[^}]*\})\s*/gy;
    var rules = [];
    var matches = [];
    var s1 = s.replace(/\s*\/\*\*[\s\S]*\*\/\s*/g, '');
    do{
    var m = pt.exec(s1);
    if(m){
        matches.push(m)
        rules.push(m[1])
    }
    }while(pt.lastIndex);
    return rules;
};
function map(func, items){
    [].forEach.call(items, func)
}
window.TQGEC = {
    enabled: true,
    getVideos: function(){
        var videos = []
        ;[].forEach.call(document.querySelectorAll(`
            .video_list_cont.tanqu_selected,
            ul.videoList li.videoListItem.tanqu_selected
        `), function(x){
            // console.log(x)
            var link = x.querySelector('a.thumb_area')
            if(!link){
                link =  x.querySelector('a.thumbArea')
            }
            var img  = link.querySelector('img')
            var author_link = x.querySelector('div.video_date a.name')
            var play_cnt = 0, like_cnt=0;
            try{
                play_cnt = x.querySelector('.video_info span.play span').textContent
            }catch(e){

            }
            try{
                like_cnt = x.querySelector('.video_info span.like span').textContent
            }catch(e){

            }
            videos.push({
                videoUrl: link.href,
                coverUrl: img.src,
                title: x.querySelector('a.video_tit, a.videoTit').textContent,
                // author_name: author_link.textContent,
                // author_url: author_link.href,
                pubdate: x.querySelector('div.video_date span.date, div.videoDate span.date').textContent
            })
        });
        ;[].forEach.call(document.querySelectorAll('ul.upcoming_list li.tanqu_selected'), function(x){
            var link = x.querySelector('.thumb._videoThumb')
            var img  = link.querySelector('img')
            videos.push({
                videoUrl: link.href,
                coverUrl: img.src,
                title: x.querySelector('.text_area .title a').textContent,
            })
        });
        return videos;
    },
    listen: function(poll_timeout, poll_interval, onSelect){
        console.log('begin listen')
        poll(function(){
            return document.querySelector('.video_list')
        }, poll_timeout, poll_interval).then(function(){
            delegate(document.querySelector('.video_list'), '.video_list_cont', 'click', onSelect);
        }).catch(function(){
            console.log('video_list not found')
        })

        poll(function(){
            return document.querySelector('ul.upcoming_list')
        }, poll_timeout, poll_interval).then(function(){
            delegate(document.querySelector('ul.upcoming_list'), 'li', 'click', onSelect);
        }).catch(function(){
            console.log('upcoming_list not found')
        })

        poll(function(){
            return document.querySelector('ul.videoList')
        }, poll_timeout, poll_interval).then(function(){
            delegate(document.querySelector('ul.videoList'), 'li.videoListItem', 'click', onSelect);
        }).catch(function(){
            console.log('ul.videoList not found')
        })
        console.log('end listen')
    }
}
window.TQGEUI = {
    poll_timeout: 20000,
    poll_interval: 500,
    // data_server: 'http://10.1.64.4:8001/collect/url',
    // data_server: "http://y10n.cn/clean_url/video.php",
    data_server: "http://pvideo-collect.kankanapp.com.cn/collect/video",
    inject_css: `
.tanqu_selected {
    border: 1px red dashed;
}
.video_list li {
    margin-left: 12px;
}
.publish-to-tanqu{
    position: fixed;
    bottom: 10px;
    right: 10px;
    text-align: center;
    size: 11em;
    color: #1ecfff;
    font-size: 1.8em;
    font-weight: bold;
    background: #414141;
    border-radius: 0.6em;
    height: 1.8em;
    line-height: 1.8em;
    padding: 0.1em;
    z-index: 2016;
}

.tanqu_publish_dialog{
    position: fixed;
    width: 640px;
    height: 480px;
    left: -webkit-calc(50% - 640px/2);
    top: -webkit-calc(50% - 480px/2);
    background: #414141;
    color: #1ecfff;
    padding: 5px;
    border-radius: 5px;
    z-index: 2017;
}
.tanqu_publish_dialog label span {
    min-width: 10em;
    display: inline-block;
}
.tanqu_publish_dialog label {
    clear: both;
    width: 100%;
    display: inline-block;
}
.tanqu_publish_dialog h3 {
    text-align: center;
    color: #1ecfff !important;
    font-size: 1em !important;
}
.tanqu_publish_dialog table {
    width: 100%;
}
.tanqu_publish_dialog table, .tanqu_publish_dialog td, .tanqu_publish_dialog th {
    text-align: center;
    border: 1px solid gray;
    border-collapse: collapse;
}
.tanqu_publish_dialog input[type="text"]{
    border: 0;
    min-width: 60%;
    max-width: 98%;
}
.tanqu_publish_dialog input[type="submit"],
.tanqu_publish_dialog input[type="reset"]
 {
    color: #1ecfff;
    background: #414141;
    padding: 0.3em;
    margin-top: 1em;
    border: 0;
}
.tanqu_publish_dialog h3 span.close {
    text-align: right;
    float: right;
}

.tanqu_publish_dialog .help{
    text-align: right;
}
    `,
    dialog_html: `
<h3>采集结果<span class="close">Close</span></h3>
<form>
    <fieldset>
        <legend>作者</legend>
        <label><span>头像地址: </span><input type="text" name="author_avatar_url" /> </label>
        <label><span>昵称: </span><input type="text" name="author_nickname" /> </label>
    </fieldset>
    <fieldset>
        <legend>采集到的视频</legend>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>地址</th>
                    <th>封面</th>
                    <!--
                    <th>作者昵称</th>
                    <th>作者头像</th>
                    -->
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td><input type="text" data-field="videoUrl" /></td>
                    <td><input type="text" data-field="coverUrl" /></td>
                    <!--
                    <td><input type="text" data-field="authorNickname" /></td>
                    <td><input type="text" data-field="authorAvatarUrl" /></td>
                    -->
                </tr>
            </tbody>
        </table>
    </fieldset>
    <div style="text-align:center">
        <input type="submit" value="提交到探趣" />
    </div>
</form>
<div class="help">
如果没有采集到的视频你可以手动填写
</div>
    `,
}


TQGEUI.onload = function(event) {
    if(document.querySelector('.publish-to-tanqu')){
        console.log('already loaded tanqu')
        return false;
    }
    var publish_btn;
    TQGEC.listen(this.poll_timeout, this.poll_interval, function(){
        this.setAttribute('class', this.getAttribute('class') + ' tanqu_selected')
        publish_btn.querySelector('span').innerText = document.querySelectorAll('.tanqu_selected').length
    })

    ;[].forEach.call(document.querySelectorAll('a'), function(x){
        x.setAttribute('target', '_blank');
    });
    parseCssRules(this.inject_css).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })
    var api_url = this.data_server;
    var publish_btn_div = document.createElement("div");
    publish_btn_div.innerHTML = "发布到探趣(<span>0</span>)";
    publish_btn_div.setAttribute('class', 'publish-to-tanqu')
    document.body.appendChild(publish_btn_div)

    var div = document.createElement("div");
    div.innerHTML = this.dialog_html;
    div.setAttribute('class', 'tanqu_publish_dialog')
    document.body.appendChild(div)

    var dialog = document.querySelector('.tanqu_publish_dialog');
    dialog.style.display = 'none'

    var tr = document.querySelector('.tanqu_publish_dialog tbody tr:nth-child(1)')
    var frag = document.createDocumentFragment()
    var i=0, n=20;
    for(;i<n-1;i++){
        var nn = tr.cloneNode(true)
        nn.querySelector('td:nth-child(1)').innerText= i + 2;
        frag.appendChild(nn)
    }
    tr.parentNode.appendChild(frag)

    delegate(dialog, 'form', 'submit', function(e){
        e.preventDefault()
         var videos = [];
         ;[].forEach.call(document.querySelectorAll('.tanqu_publish_dialog tbody tr'), function(tr, i){
            var url = tr.querySelector('[data-field="videoUrl"]').value,
            cover = tr.querySelector('[data-field="coverUrl"]').value;
            if(url && cover && isUrl(url) && isUrl(url)){
                videos.push({url:url, cover:cover})
            }
         })
         var payload = {
             'avatar': document.querySelector('.tanqu_publish_dialog input[name="author_avatar_url"]').value,
             'name': document.querySelector('.tanqu_publish_dialog input[name="author_nickname"]').value,
             'videoList': videos
         }
         if(payload['avatar'] && !isUrl(payload['avatar'])){
            alert('头像必须是地址');
            return false;
         }

         if(videos.length){
            dialog.querySelector('input[type="submit"]').setAttribute('disabled', true)
             var xhr = new XMLHttpRequest();
             xhr.open("POST", api_url, true);
             xhr.onreadystatechange = function() {
               if (xhr.readyState == 4) {
                    // var response = JSON.parse(xhr.responseText)
                    var response = {status: true, message: 'ok'}
                    if(xhr.responseText != 'OK'){
                        response.status = false
                        response.message = xhr.responseText
                    }
                    console.log(response);
                    if(response.status){
                        alert('提交成功，惊待佳音')
                        dialog.style.display = 'none'
                    }
                    else{
                        alert(response.message)
                    }
                    dialog.querySelector('input[type="submit"]').removeAttribute('disabled')
               }
             }

             xhr.send(JSON.stringify(payload));
         }
         else{
            alert('视频、截图信息必须完整，且为网址，不能为空！');
         }
        return false;
    })
    delegate(dialog, 'h3 span.close', 'click', function(e){
        e.preventDefault()
        dialog.style.display = 'none';
    })
    publish_btn = document.querySelector('.publish-to-tanqu')
    publish_btn.addEventListener('click', function(x){
        var videos = TQGEC.getVideos()
        // console.log(JSON.stringify(videos))
        var tbody = dialog.querySelector('table tbody');
        map(function(x, i){
            var tr = tbody.querySelector('tr:nth-child('+(i+1)+')')
            tr.querySelector('[data-field="videoUrl"]').value = x.videoUrl
            tr.querySelector('[data-field="coverUrl"]').value = x.coverUrl
            // tr.querySelector('[data-field="authorNickname"]').value = x.author_name
        }, videos)
        dialog.style.display = 'block'
        return false;
    })
}
TQGEUI.init = function(){
    if(document.readyState == 'complete'){
        this.onload()
    }
    else{
        document.addEventListener("DOMContentLoaded", this.onload)
    }
}

TQGEUI.init()
