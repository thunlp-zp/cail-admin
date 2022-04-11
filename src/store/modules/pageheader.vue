<template>
<div id="navbar">
    <div class="navuser navbar-dropdown"  style="position: relative; margin-right: 0px; margin-top: 8px;">
        <button class="btnzhx">
            往届链接
        </button>
        <div class="dropdown-block">
            <div class="dropdown-content">
                <div class="dropdown-selector"><a style="text-decoration: none;" href="http://cail.cipsc.org.cn:2018/" target="_blank">CAIL2018</a></div>
                <div class="dropdown-selector"><a style="text-decoration: none;" href="http://cail.cipsc.org.cn:2019/" target="_blank">CAIL2019</a></div>
            </div>
        </div>
    </div>
    <div class="navgrid" v-on:click="goto('index')" v-bind:class="{ active: activeGrid == 'shouye' }" id="shouye">大赛首页</div>
    <div class="navgrid" v-on:click="goto('instruction')" v-bind:class="{ active: activeGrid == 'shuoming' }" id="shuoming">大赛说明</div>
    <div class="navgrid" v-on:click="goto('ranking')" v-bind:class="{ active: activeGrid == 'paiming' }" id="paiming">大赛排名</div>
    <div class="navuser" v-if="userName == null" v-on:click="login_show = true">登录</div>
    <div class="navuser navbar-dropdown" v-else>
        <img id="navbar-avatar" src="/static/img/touxiang.jpeg" width="40px" height="40px" />
        <div class="dropdown-block">
            <div class="dropdown-content">
                <div class="dropdown-selector" v-on:click="userinfo_show=true">个人中心</div>
                <div class="dropdown-selector" v-on:click="upload_show=true">上传模型</div>
                <div class="dropdown-selector" v-on:click="resubmit_show=true">重新提交模型</div>
                <div class="dropdown-selector" v-on:click="doLogout">登出</div>
            </div>
        </div>
    </div>
    <login-dialog v-if="login_show" x="322" y="710" v-on:closed="loginClosed" />
    <resubmit-dialog v-if="resubmit_show" x="322" y="710" v-on:closed="resubmit_show = false"/>
    <upload-dialog v-if="upload_show" x="20" y ="511" v-on:closed="upload_show = false" v-bind:tasks="tasks" v-bind:default-task="defaultTask" />
    <userinfo-dialog v-if="userinfo_show" x="150" y ="511" v-on:closed="userinfo_show = false"/>
</div>
</template>
<script>
import LoginDialog from "@/components/dialog/login.vue";
import UserinfoDialog from "@/components/dialog/userinfo.vue";
import UploadDialog from "@/components/dialog/upload.vue";
import ResubmitDialog from "@/components/dialog/resubmit.vue";
export default {
    props: {
        activeGrid: String,
        tasks: {
            type: Array,
            required: true,
            default: []
        },
        defaultTask: {
            type: Number,
            default: 0
        }
    },
    data: () => ({
        userName: null,
        login_show: false,
        userinfo_show: false,
        upload_show: false,
        resubmit_show: false,
    }),
    created() {
        window.addEventListener("setUser", (ev) => {
            this.userName = API.getUser();
        });
        this.userName = API.getUser();
    },
    methods: {
        goto(path) {
            window.document.location.href = path + ".html";
        },
        loginClosed(succ) {
            this.login_show = false;
            if (succ) {
                this.userName = succ;
                API.setUser(succ);
                API.doRefresh();
            }
            else {
                this.userName = null;
            }
        },
        doLogout() {
            API.clearUser();
            this.userName = null;
            API.doRefresh();
        }
    },
    components: { LoginDialog, UserinfoDialog, UploadDialog, ResubmitDialog }
}
</script>

<style>
#navbar {
    position: absolute;
    top: 0;
    width: 100%;
    right: 0;
    height: 60px;
    text-align: right;
}

.navgrid {
    width: 104px;
    font-size: 18px;
    user-select: none;
    height: 36px;
    text-align: center;
    display: inline-block;
    margin-top: 8px;
    padding-top: 5px;
    margin-right: 70px;
    cursor: pointer;
    box-sizing: border-box;
    vertical-align: middle;
}

.btnzhx {
    padding-left: 4px;
    width: 104px;
    height: 36px;
    text-align: center;
    padding-top: 5px;
    margin-right: 70px;
    cursor: pointer;
    box-sizing: border-box;
    vertical-align: middle;
    border: none;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    color: rgba(16, 121, 244, 1);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 15px;
    box-shadow: 0 0 5px rgba(16, 121, 244, 0.5);
}
.navuser {
    margin-right: 330px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
}

.navgrid.active {
    color: rgba(16, 121, 244, 1);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 15px;
    box-shadow: 0 0 5px rgba(16, 121, 244, 0.5);
}

#navbar-avatar {
    border-radius: 20px;
    position: relative;
    top: 3px;
}

.navuser.navbar-dropdown {
    text-align: center;
    position: relative;
    line-height: 16px;
}

.navuser.navbar-dropdown .dropdown-content {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 20px rgba(120, 120, 120, 0.6);
    border-radius: 4px;
    display: none;
}

.navuser.navbar-dropdown .dropdown-content:hover,
.navuser.navbar-dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-block {
    position: absolute;
    left: 0px;
    width: 200px;
    padding-top: 10px;
    user-select: none;
}

.dropdown-content .dropdown-selector {
    color: rgba(51, 51, 51, 1);
    font-size: 16px;
    text-align: left;
    padding-left: 25px;
    padding-right: 40px;
    line-height: 48px;
    height: 48px;
    font-weight: bold;
}

.dropdown-content .dropdown-selector:first-child {
    border-radius: 4px 4px 0 0;
}

.dropdown-content .dropdown-selector:last-child {
    border-radius: 0 0 4px 4px;
}

.dropdown-content .dropdown-selector:hover {
    color: rgba(16, 121, 244, 1);
    box-shadow: 8px 0px 0px rgba(16, 121, 244, 1) inset;
}

</style>
