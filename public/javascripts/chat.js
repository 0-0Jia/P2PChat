var user = {};
var imgResult = "";
var toOneId = "";
var headSrc = "/images/1.jpg";
var userOnline = [];
var imgSrc = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg"
];



function addAlert(type, name, message) {
    let alertStr = `
    <div class="${type} alert" uk-alert>
        <p>${name}${message}。</p>
    </div>`;
    document.body.insertAdjacentHTML("afterbegin", alertStr);
}

function addMember(location, head, name, group, id) {
    let memberStr = `
        <li class="${id} ${location}" onclick="modalShow(this)" id="${id}">
            <img class="user-head" src="${head}" />
            <div class="user-info">
                <p class="user-name">${name}</p>
                <p class="user-group">${group}</p>
            </div>
        </li>
        `;
    document.getElementById("members").insertAdjacentHTML(location, memberStr);
}

function addMessage(location, head, name, message) {
    let messageStr = `
    <div class="${location} cmsg">
        <img class="headIcon radius" ondragstart="return false;" oncontextmenu="return false;"
            src="${head}" />
        <span class="name">${name}</span>
        <span class="content">${message}</span>
    </div>`;
    document.getElementsByClassName("lite-chatbox")[0].insertAdjacentHTML("beforeend", messageStr);
}

function addImg(location, head, name, imgSrc) {
    let messageStr = `
    <div class="${location} cmsg">
        <img class="headIcon radius" ondragstart="return false;" oncontextmenu="return false;"
            src="${head}" />
        <span class="name">${name}</span>
        <span class="content"><img class="chat-img" src="${imgSrc}"></span>
    </div>`;
    document.getElementsByClassName("lite-chatbox")[0].insertAdjacentHTML("beforeend", messageStr);
}

function removeDom(className) {
    if (userOnline.indexOf(className) > -1) {
        let el = document.getElementsByClassName(className)[0];
        el.parentNode.removeChild(el);
    }
}

function modalShow(dom){
    if(dom.className.indexOf('beforeend') !== -1){
        toOneId = dom.getAttribute('id');
        console.log(toOneId)
        $('#toOneModal').modal('show');
    }
}


$(function () {
    $('#loginModal').modal('show');
});

/*用户信息确认*/
$('#sure-button').on('click', function () {
    if (!$('#userName').val() || !$('#userGroup').val()) {
        alert("请检查是否填写完整噢！");
        return false;
    }
    if ($('#userName').val().length > 12) {
        alert("用户名请限制在12个字以内！");
        return false;
    }
    if ($('#userGroup').val().length > 12) {
        alert("用户名请限制在12个字以内！");
        return false;
    }
    user = {
        src: headSrc,
        name: $('#userName').val(),
        group: $('#userGroup').val()
    };
    $('#loginModal').modal('hide');
    socket.emit('login', user);
    // $('.user-name').text(user.name);
    // $('.user-group').text(user.group);
})


/*选择头像*/
$('.head-option').on('click', function (e) {
    let index = $(".head-option").index(this);
    headSrc = imgSrc[index];
    $('.head-selected').text(e.target.innerText);
})

/*信息发送*/
$('form').submit(function (e) {
    e.preventDefault();
    if (!user.name || !user.group) {
        user = {
            src: "/images/1.jpg",
            name: "游客",
            group: "未标识组别"
        };
    }
    user.msg = $('#m').val();
    socket.emit('chat message', user);
    $('#m').val('');
    return false;
});


/*图片上传*/
$('#chooseImage').on('change', function (e) {
    var filePath = $(this).val();
    fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    if (!user.name || !user.group) {
        user = {
            src: "/images/1.jpg",
            name: "游客",
            group: "未标识组别"
        };
    }

    // 检查是否是图片
    if (!fileFormat.match(/.png|.jpg|.jpeg/)) {
        alert('上传错误,文件格式必须为：png/jpg/jpeg');
        return false;
    }

    var fr = new FileReader();
    if (!fr) {
        alert("error!");
    }
    fr.onload = (e) => {
        imgResult = e.target.result;
        var msgObj = {
            user: user,
            uploadImg: imgResult
        }
        socket.emit('chatImg', msgObj);
    };
    fr.readAsDataURL(e.target.files[0]);
});


/*发送给单个人*/
$('#send-btn').on('click', function () {
    if (!$('#to-one-message').val()) {
        alert("输入不能为空噢");
        return false;
    }
    if ($('#to-one-message').val().length > 200) {
        alert("信息请限制在200个字以内！");
        return false;
    }
    oneMsg = {
        from: user,
        id: toOneId,
        msg: $('#to-one-message').val()
    };
    console.log(oneMsg);
    $('#toOneModal').modal('hide');
    socket.emit('toOne', oneMsg);
})
