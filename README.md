# COVID-19健康管理社区App
  本项目为ECE1779 Intro to computing Final Project的优化版本。原本功能包括：附近医院查询，附近医院疫苗预约，发消息联系医院，个人预约管理，以及添加自动聊天bot辅助用户进行新冠自诊断或通过bot进行语音/文字预约的服务。还实现了后台定时触发的程序，按时清理过期数据库中内容以及提前24小时邮件提示有预约的用户。
<br/>
  优化版本添加浏览社区其他用户的防疫分享，发布新的博客等功能.
  <br/><br>
  项目应用AWS云平台，实现Serverless开发。关系型数据库在RDS上进行存储，通过服务器SQLAlchemy进行调用；图片数据存储在S3中，通过生成公开url进行访问；后台程序借助于Lambda定时触发；通过Zappa部署将服务存储为函数，并实现按需扩容等。
   <br/><br>
   ## 技术栈：
   前端：HTML5 + CSS3 + JavaScript + Jquery
   <br/>
   后端：Python Flask + Jinja2 + MySQL + SQLalchemy
   <br/>
   其他：Avatar，Migrate...
    <br/><br>
    ## 项目结构：
    ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/09c3b1427b6c6ffbe241ec7a838a9911cd54148a/demo_images/WechatIMG705.jpeg)
    <br/>
   ## 项目运行：
   ```bash
   cd /medical
   $ Python -m venv venv
   $ Source venv/bin/activate
   $ pip install -r requirements.txt
   $ zappa init
   $ zappa deploy dev #for the first time
   $ zappa update dev
   ```
  
   ## Demo:
   ### Register and Log in:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG688.jpeg)
![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG689.jpeg)
  <br/>
   ### Medical Resources:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG690.jpeg)
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG691.jpeg)
     <br/>
   ### Reservation for Vaccinations
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG693.jpeg)  
     <br/>
   ### Explore:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG694.jpeg) 
     <br/>
   ### Detail:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG695.jpeg)
     <br/>
   ### Comments:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/3ab668575aaead0f3517ea2cdc47a91dcce7e9b0/demo_images/WechatIMG697.jpeg)
     <br/>
   ### Publish:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/ad573f3636559934e405e82804e9f0a7f11a1f22/demo_images/WechatIMG700.jpeg)
   <br/>
   ### Messages:
   ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/a31d7dfe98c8c1c6b41a2bb41bceeea8e7b76d1b/demo_images/WechatIMG701.jpeg)
    <br/>
    ### Bot:
    ![](https://github.com/liuxiaoyu-LXY/COVID19_Manage/blob/a31d7dfe98c8c1c6b41a2bb41bceeea8e7b76d1b/demo_images/WechatIMG704.jpeg)
    </br>
