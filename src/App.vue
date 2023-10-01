<template>
  <div class="container">
    <div class="header flexRowCenterAll">
      <div class="flexRowCenterAll">
        <img src="https://scdn.shanxingqiu.com/static/avatar.jpeg?imageView2/1/w/80/h/80" alt="">
        <span>善星球公益发展中心出品</span>
      </div>
    </div>
    <div class="main flexColumn">
        <div class="flexRowCenterAll"
          style="width: 100%;height: 10rem;margin: 1rem 0;justify-content: space-around;">
          <div class="flexColumnCenterAll" @click="howToUseVis = true"
          style="cursor: pointer;">
            <i class="el-icon-question" style="color:#409EFF;font-size: 3rem;"></i>
            <br>
            <span>点我查看使用方法</span>
          </div>
          <div class="flexColumnCenterAll" @click="()=>{
            this.token ? '' : this.keySet = true;
          }" style="cursor: pointer;">
            <i v-if="token" class="el-icon-check" style="color: #67C23A;font-size: 3rem;"></i>
            <i v-else class="el-icon-close" style="color: red;font-size: 2rem;"></i>
            <br>
            <span v-bind:style="{'color': token ? '#67C23A' : 'red'}">{{ token ? '已设置 Token' : '未设置 Token' }}</span>
          </div>
          <div class="flexColumnCenterAll" @click="keySet = true" style="cursor: pointer;">
            <i class="el-icon-setting" style="color:#409EFF;font-size: 3rem;"></i>
            <br>
            <span>点我设置你的token</span>
          </div>
        </div>
        <el-divider></el-divider>
        <el-input
          :disabled="inputDis"
          v-model="fileBolder"
          type="text"
          style="width: 90vw;margin-bottom: 1rem;"
          placeholder="如果需要存在某个文件夹下请输入文件夹的相对路径"
          placeholder-style="color:red"></el-input>
        <el-upload
          ref="upload"
          class="upload-demo flexColumnCenterAll"
          drag
          :action="action"
          :auto-upload="false"
          :on-change="handleChange"
          :http-request="handleRequest"
          :multiple="true"
          list-type="picture"
        >
          <template #trigger>
            <i class="el-icon--upload el-icon-plus" style="font-size: 3rem;"></i>
            <div class="el-upload__text">
              拖拽至此或点击选择上传
            </div>
          </template>
          <template #file="file">
            <div class="fileListItem flexColumn"  v-if="isPageVis">
              <div class="fileInfo flexRow">
                <div class="fileImg flexRowCenterAll">
                  <i class="el-icon-picture" v-if="file.file.raw.type.includes('image')"></i>
                  <i class="el-icon-video-camera-solid" v-if="file.file.raw.type.includes('video')"></i>
                </div>
                <span class="fileName ellipsis"> {{ file.file.name }} </span>
              </div>
              <br v-if="showPercent">
              <div class="filePercent" v-show="showPercent">
                <el-progress v-if="filesJson[file.file.uid] < 100" :percentage="filesJson[file.file.uid]" />
                <div
                  v-if="filesJson[file.file.uid] === 100"
                  class="uploadSuccess flexRow">
                  <i class="el-icon-check" style="color: #67C23A;font-size: 3rem;"></i>
                </div>
              </div>
            </div>
          </template>
          <el-button type="success" size="large" style="margin: 1rem 0;" @click="submitUpload">
            点我提交上传
          </el-button>
        </el-upload>
      </div>


    <el-drawer title="使用方法" :visible.sync="howToUseVis" direction="btt">
      <p class="upP">1.找到手机设置中设备的序列号并且复制</p>
      <p class="upP">2.点击页面上的设置Token</p>
      <p class="upP">3.输入Token并提交</p>
      <br>
      <p class="upP">作者联系方式：19857191790</p>
    </el-drawer>

    <el-drawer title="设置Token" :visible.sync="keySet" direction="btt">
      <el-form :model="keySetForm" :rules="keySetRules" ref="keySetRef">
          <el-form-item prop="key">
            <el-input v-model="keySetForm.key" size="large" placeholder="请输入Token" />
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="keySet = false">取消</el-button>
            <el-button type="primary" @click="submitForm">
              确认
            </el-button>
          </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
    import { uploadFile } from './utils/uploaderHelper'
    import { getToken,setToken } from './utils/token'
    import { getTokenByMobileId } from './utils/sql'
    export default{
      data(){
        return{
          token:getToken() || '',
          keySetForm:{
            key:''
          },
          inputDis:false,
          fileBolder:'',
          action:'https://up-z0.qiniup.com',
          filesJson:{
            total:0
          },
          showPercent:false,
          uploadedTotal:0,
          keySet:false,
          howToUseVis:false,
          keySetRules:{
            key:[
              {
                required: true,
                message: '请输入Token',
                trigger: 'blur'
              }
            ]
          },
          isPageVis:true
        }
      },
      watch:{
        uploadedTotal(val){
          if(val === this.filesJson.total){
            this.inputDis = false
          }
        }
      },
      created(){
        if(this.token){
          this.getTOkenSSS()
        }
        document.addEventListener("visibilitychange",this.handleVisibilityChange)
      },
      destroyed(){
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      },
      methods:{
        handleVisibilityChange() {
          console.log(document.visibilityState);
          if (document.visibilityState === "visible") {
            // 页面从后台切回前台
            this.isPageVis = true;
          } else {
            // 页面切到后台
            this.isPageVis = false;
          }
        },
        async getTOkenSSS(){
          const res = await getTokenByMobileId(this.token)
        },
        handleChange(file){
          if(!this.filesJson[file.uid] && file.status === 'ready'){
            this.filesJson[file.uid] = 0
            this.filesJson.total+=1
            console.log(this.filesJson,'filesJson');
          }
        },
        async handleRequest(e){
          let uid = e.file.uid
          this.showPercent = true
          this.inputDis = true
          await uploadFile(e.file,this.fileBolder).subscribe({
            next: (result) => {
              console.log(result,this.filesJson);
              let per = parseInt(result.total.percent.toFixed(0))
              this.filesJson[uid] = per
              this.$forceUpdate()
            },
            error: (err) => {
              this.$message({
                message:`${err.name} ${err.message}`,
                type:'error',
                duration:5000
              })
              this.showPercent = false
            },
            complete: (e) => {
              this.uploadedTotal++
              this.$message({
                message:`'文件${e.key}'上传成功`,
                type:'success',
                duration:5000
              })
            }
          });
        },
        async submitForm(){
          if(this.keySetForm.key !== ''){
            const res = await getTokenByMobileId(this.keySetForm.key)
            console.log(res);
            if(res.status == 200 && res.data.length !== 0){
              setToken(this.keySetForm.key)
              this.token = getToken() || ''
              this.keySet = false
              this.$message({
                message:'设置Token成功',
                type:'success',
                duration:5000
              })
            }else{
              this.$message.error(`设置Token失败,${res.error || ''}`)
            }
          }
        },
        submitUpload(){
          if(!this.token){
            this.$message.error('请先设置Token')
            return
          }
          this.$refs.upload.submit()
        }
      }
    }
</script>

<style lang="scss" scoped>
  @import './style.scss';
  .container{
    .header{
      height: 50px;
      font-size: 1.2rem;
      box-shadow: 0 0 16px #b8b8b8;
      width: 100vw;
      box-sizing: border-box;
      img{
        width: 3rem;
        height: 3rem;
        margin: 0 1rem;
      }
    }
    .main{
      padding-top: 50px;
      width: 100vw;
      align-items: center;
      .fileListItem{
        width: 100%;
        min-height: 100%;
        justify-content: space-between;
        padding: 1rem;
        .fileInfo{
          width: 100%;
          height: 100%;
          align-items: center;
          .fileName{
            width: calc(100% - 4.5rem);
            margin-left: 0.5rem;
          }
          .fileImg{
            width: 4rem;
            height: 100%;
            object-fit: cover;
            overflow: hidden;
            font-size: 3rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .uploadSuccess{
          justify-content: flex-end;
          color: #67C23A;
        }
      }

    }
    .el-button{
      width: 40vw;
      height: 4rem;
    }
    .el-drawer__body .upP{
      font-size: 1rem;
    }
  }
</style>
<style lang="scss">
  .main{
    .el-upload-list__item{
      padding: unset !important;
      height: auto !important;
    }
    .fileImg{
      .el-icon{
        font-size: 3rem;
      }
    }
    .el-upload{
      width: 90vw;
    }
    .el-upload-list{
      width: 90vw;
    }
    .el-upload-dragger{
      border-width: 2px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .el-input__wrapper{
      box-shadow: 0 0 0 2px var(--el-input-border-color,var(--el-border-color)) inset;
    }
    .el-progress{
      display: flex;
      justify-content: space-between;
      .el-progress-bar{
        all: unset;
        width: 88%;
      }
      .el-progress__text{
        all: unset;
        width: 10%;
      }
    }
    .el-input__inner::placeholder {
      color: red;
    }
  }
  .el-drawer__body{
    padding: 2rem;
  }
</style>