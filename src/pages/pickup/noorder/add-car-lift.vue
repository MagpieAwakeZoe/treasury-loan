<template>
    <div class="pg-add-car-lift">
        <title-bar>录入提车人</title-bar>
        <div class="notice-bar">
            1、提车人信息为库管核实依据，请确保与实际提车人一致，以免延误提车，提车请携带有效身份证件<br>
            2、未做业务的车辆发起的提车申请不允许修改或取消
        </div>
        <som-list label-width="100px">
            <som-input :show-clear="false" title="<i class='require-icon'>*</i>提车时间"
                       placeholder="请选择日期" v-model="form.estimatedPickDate"
            @click.native="dateShow = true" readonly>
                <som-icon :size="16" name="arrow-right" slot="right" color="#bfbfbf"></som-icon>
            </som-input>
            <som-input :show-clear="false" title="<i class='require-icon'>*</i>提车人姓名"
                       placeholder="请输入姓名" v-model="form.carPickerName">
                <span slot="right" :style="{ 'color': '#508CEE' }" @click="getFrequentCarPicker">选择提车人</span>
            </som-input>
            <som-input type="tel" :show-clear="false" :max="11" title="<i class='require-icon'>*</i>手机号码"
                       placeholder="请输入手机号码" v-model.trim="form.carPickerMobile">
            </som-input>
            <som-input :show-clear="false" :max="18" title="<i class='require-icon'>*</i>身份证号码"
                       placeholder="请输入身份证号码" v-model.trim="form.idCardNo">
            </som-input>
        </som-list>
        <div class="form-footer">
            <input type="checkbox" class="icon-checkbox" v-model="form.isFrequentPicker">
            <label>保存为常用提车人</label>
        </div>
        <fixed-bottom>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="submit"
            :delayTime="2000">确定</som-button>
        </fixed-bottom>
        <div v-transfer-dom>
            <som-popup v-model="dateShow">
                <som-date-picker
                        type="date"
                        :minDate="minDate"
                        value-format="yyyy-MM-dd"
                        @on-confirm="onConfirm"
                        @on-cancel="dateShow = false">
                </som-date-picker>
            </som-popup>
        </div>
        <som-popup v-model="show2" height="337px">
            <div class="lift-choose">
                <div class="popup-title"><i class="som-icon-close" @click="show2 = false"></i>选择常用提车人
                    <span class="edit" @click="editable = !editable" v-if="carPickers.length">{{editable ? '完成' : '编辑'}}</span></div>
                <div class="list-container" v-if="carPickers.length">
                    <div class="list" v-for="(item, $index) in carPickers" :key="$index">
                        <div @click="choose(item)" class="left">
                            <p class="name">{{item.carPickerName}}</p>
                            <p class="number">{{item.idCardNo}}<span class="line-between"></span>{{item.carPickerMobile}}</p>
                        </div>
                        <span class="icon-grey-delete" v-show="editable"
                              @click="deleteCarPicker(item.frequentPickerId)"></span>
                    </div>
                </div>
                <div v-else class="no-item">暂无常用提车人</div>
            </div>
        </som-popup>
        <som-modal v-model="modalShow"
                   title="确定删除常用提车人？"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="confirmDeletePicker()">
        </som-modal>
    </div>
</template>

<script>
import Api from '@/api';
import fixedBottom from '@/components/fixed-bottom.vue';

export default {
    name: 'AddCarLiftNoOrder',
    data () {
        return {
            form: {
                carPickerName: '',
                estimatedPickDate: '',
                idCardNo: '',
                carPickerMobile: '',
                isFrequentPicker: false
            },
            minDate: new Date(),
            dateShow: false,
            show2: false,
            modalShow: false,
            editable: false,
            frequentPickerId: '',
            carPickers: []
        };
    },
    components: {
        fixedBottom
    },
    methods: {
        choose (item) {
            let {carPickerName, carPickerMobile, idCardNo} = item;
            this.form = Object.assign(this.form, {carPickerName, carPickerMobile, idCardNo});
            this.show2 = false;
        },
        onConfirm (val) {
            this.dateShow = false;
            this.form.estimatedPickDate = val;
        },
        deleteCarPicker (id) { // 删除常用提车人
            this.modalShow = true;
            this.frequentPickerId = id;
        },
        confirmDeletePicker () { // 确认删除常用提车人
            this.modalShow = false;
            Api.fsc.v1_carPickerApi_deleteFrequentCarPicker({
                frequentPickerId: this.frequentPickerId
            }).then(() => {
                this.getFrequentCarPicker();
            });
        },
        // 获取常用提车人
        getFrequentCarPicker () {
            setTimeout(() => {
                this.show2 = true;
                Api.fsc.v1_carPickerApi_getFrequentCarPicker().then((res) => {
                    this.carPickers = res;
                });
            }, 500);
        },
        submit () {
            if (this.validForm()) {
                this.addNewPickupRequest();
            }
        },
        validForm () {
            this.form.carPickerMobile = this.form.carPickerMobile.replace(/\s+/g, '');
            this.form.idCardNo = this.form.idCardNo.replace(/\s+/g, '');
            if (!this.form.estimatedPickDate) {
                this.$som.toast.text('请选择提车时间');
                return false;
            }
            if (!this.form.carPickerName) {
                this.$som.toast.text('请输入提车人姓名');
                return false;
            }
            if (!this.form.carPickerMobile) {
                this.$som.toast.text('请输入提车人手机号码');
                return false;
            }
            if (this.form.carPickerMobile.length !== 11) {
                this.$som.toast.text('请输入有效的手机号码');
                return false;
            }
            if (!this.form.idCardNo) {
                this.$som.toast.text('请输入提车人的身份证号码');
                return false;
            }
            if (this.form.idCardNo.length !== 15 && this.form.idCardNo.length !== 18) {
                this.$som.toast.text('请输入有效的身份证号码');
                return false;
            }
            return true;
        },
        addNewPickupRequest () {
            let carIds = Array.isArray(this.$route.query.carIds) ? this.$route.query.carIds : this.$route.query.carIds.split(',');
            let arg = {data: JSON.stringify({
                ...this.form,
                carIds: carIds
            })};
            this.$som.loading.show({
                text: '提交中'
            });
            Api.fsc.v1_orderDeletedCarApi_orderDeletedAddNewPickupRequest(arg).then((res) => {
                this.$router.replace({path: '/pickup-detail/noorder', query: {carPickUpNo: res}});
            });
        }
    },
    mounted () {
        this.$setBodyBack();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-add-car-lift{
    // reset
    .som-input--disabled .som-list-item__bd, .som-input--disabled .som-list-item__hd{
        color: #1a1a1a;
    }
    .som-input__elm:disabled{
        background: none;
        color: #1a1a1a;
    }
    .notice-bar{
        background: #FFF2BD;
        padding: 12px 16px;
        font-size: 14px;
        line-height: 20px;
        color: @primary;
    }
    .form-footer{
        margin: 16px;
        font-size: 16px;
        line-height: 1;
        display: flex;
        align-items: center;
        label{
            margin-left: 12px;
        }
    }
    .lift-choose{
        background: #fff;
        height: 100%;
        .list-container{
            overflow-y: scroll;
            height: calc(~"100% - 49px");
            padding-left: 16px;
            .list{
                .border-bottom();
                height: 25%;
                padding-right: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                line-height: 1;
                .left{
                    flex: 1;
                }
                .name{
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .number{
                    color: #666;
                    display: flex;
                    align-items: center;
                }
                .line-between{
                    .border-right();
                    margin: 0 8px;
                    display: inline-block;
                    height: 10px;
                }
            }
        }
        .no-item{
            font-size: 14px;
            color: #999;
            margin-top: 100px;
            text-align: center;
        }
    }
    .popup-title{
        font-size: 16px;
        line-height: 49px;
        text-align: center;
        position: relative;
        .border-bottom();
        .som-icon-close{
            position: absolute;
            left: 16px;
            top: 16px;
            z-index: 1;
            width: 16px;
            height: 16px;
            color: #ccc;
        }
        .edit{
            position: absolute;
            right: 16px;
            top: 0;
            font-size: 14px;
            z-index: 1;
            color: @blue;
        }
    }
}
</style>

