1. 需要执行 npm install 安装所有依赖的node包
2. 项目目前只是完成了后端信息录入功能，前端页面正在开发中，如果有时间我会补齐的
3. 数据库MongoDB结构
koa 库包含 ,admin,article,articlecate,forcus,link,nav,setting,user 这些表
admin 表包含 ,username,password,status,image,last_login_date 这些字段
article 表包含 ,pid,catename,title,author,is_best,is_hot,is_new,keywords,description,content,img_url,create_time,status 这些字段
articlecate 表包含 ,title,pid,keywords,status,description,add_time 这些字段
forcus 表包含 ,title,description,pic,add_time,link,sort 这些字段
link 表包含 ,title,link,pic,add_time,status 这些字段
nav 表包含 ,title,url,add_time,status 这些字段
setting 表包含 ,site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time,site_logo 这些字段
user 表包含 ,username,age,sex,password,static 这些字段




