<template>
    <div :class="['pg-add-car']">
        <title-bar :isLeftEventDefault="false" @leftBarEvent="leftBarEvent">{{title}}</title-bar>
        <div class="content">
            <div v-for="(item, index) in orderDetailCarInfo" :key="index" class="add-content">
                <form-item-title :text="`第 ${index + 1} 款`" @clickItem='deleteCar(index)'
                                 :backgroundColor="'#508CEE'" :color="'#fff'"
                                 :showRight="orderDetailCarInfo.length > 1" :padding="'16px'"></form-item-title>
                <form-item-content :text="'选择车型'"
                                   :mainContent="`${item.seriesName} ${item.modelName}`"
                                   :subContent="item.guidePrice ? `指导价: ${item.guidePrice / 1000000}万` : ''"
                                   @clickItem="chooseCar(index)"></form-item-content>

                <car-decorate :decorateList="item.decorateList"
                              :carIndex="index"
                              :car="item"
                              @addItem="addItem"
                              @deleteItem="deleteItem"
                              @changeDecorateItem="changeDecorateItem"></car-decorate>

            </div>

            <!--支付宝不识别元素pg-add-car底部的margin和padding，为了兼容支付宝浏览器底部被fixed的button覆盖增加空元素-->
            <br/>
            <br/>
            <br/>
        </div>
        <my-button :text="'保存'" :text2="'继续添加车辆'"
                   @click='nextStep' @click2='addCar'
                   :isFixed="true" :is2Btn="true"></my-button>

        <som-modal v-model="showDeleteModal"
                   title="确定删除车辆？"
                   is-confirm
                   @on-cancel="showDeleteModal = false"
                   @on-confirm="onConfirm">
        </som-modal>
        <som-modal v-model="showExitModal"
                   title="变动的车辆信息不会被保存"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="backStartOrder">
        </som-modal>

        <car-selector v-model="showCarSelector"
                      @selected="selectedCar" :title="title"/>
    </div>
</template>

<script>
    import myButton from '@/components/order/my-button';
    import formItemTitle from '@/components/order/form-item-title';
    import formItemContent from '@/components/order/form-item-content';
    import carDecorate from '@/components/order/car-decorate';
    import CarSelector from '@/components/selector/car-selector';
    import Helper from '@/utils/helper';

    const decorateModel = {
        quantity: '', // 车辆数量
        interiorColorCode: '', //内饰颜色编码
        interiorColor: '', // 内饰颜色
        appearanceColorCode: '', // 外观颜色编码
        appearanceColor: '', //外观颜色
        contractPrice: '', // 合同单价
        totalDeposit: '' // 已支付定金总额
    };

    const carModel = {
        brandCode: '',
        brandName: '',
        seriesCode: '',
        seriesName: '',
        modelCode: '',
        modelName: '',
        guidePrice: '', // 指导价
        decorateList: [{...decorateModel}],
    };

    export default {
        components: {CarSelector, myButton, formItemTitle, formItemContent, carDecorate},
        data () {
            return {
                title: '添加车辆',
                showDeleteModal: false,
                showExitModal: false,
                currentCarIndex: -1,
                showCarSelector: false,
                carSelectorIndex: 0,
                orderDetailCarInfo: [JSON.parse(JSON.stringify(carModel))],
                isAlipay: Helper.isAlipay(),
            };
        },
        destroyed() {
            //window.removeEventListener('focusin', this.correctTop);
        },
        mounted() {
            //window.addEventListener('focusin', this.correctTop);
            this.$setBodyBack('#f2f2f2');
            this.orderDetailCarInfo = JSON.parse(localStorage.getItem('treasury-loan-car-list'));
            if (!this.orderDetailCarInfo || this.orderDetailCarInfo.length === 0) {
                this.orderDetailCarInfo = [JSON.parse(JSON.stringify(carModel))];
            }
        },
        methods: {
            correctTop () {
                // 软键盘弹出以后的位置校正
                if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                    const activeEleTop = document.activeElement.getBoundingClientRect().top;
                    document.documentElement.scrollTop = activeEleTop;
                    document.body.scrollTop = activeEleTop;
                }
            },
            leftBarEvent() {
                if (this.orderDetailCarInfo && this.orderDetailCarInfo[0].modelCode) {
                    Array.from(document.getElementsByTagName('input')).forEach((input) => {
                        input.blur();
                    });  // iOS下隐藏光标穿透
                    this.showExitModal = true;
                } else {
                    this.$router.go(-1);
                }
            },
            chooseCar(index) {
                this.showCarSelector = true;
                this.carSelectorIndex = index;
            },
            selectedCar(item) {
                this.$set(this.orderDetailCarInfo, this.carSelectorIndex, {
                    ...item,
                    decorateList: [{...decorateModel}],
                });
            },
            backStartOrder() {
                this.$router.go(-1);
            },
            onConfirm() {
                this.showDeleteModal = false;
                this.orderDetailCarInfo.splice(this.currentCarIndex, 1);
            },
            nextStep() {
                if (this.validate()) {
                    localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.orderDetailCarInfo));
                    this.backStartOrder();
                }
            },
            validate() {
                return this.orderDetailCarInfo.every((carItem) => {
                    if (!carItem.modelCode) {
                        this.$som.toast.text('请选择车型');
                        return false;
                    }
                    if (carItem.decorateList.length) {
                        const getFloatNum = (num) => {
                            if (typeof num === 'number') {
                                let x = String(num).indexOf('.') + 1;   //小数点的位置
                                let floatNum = x && String(num).length - x;  //小数的位数
                                return floatNum;
                            }
                            return 0;
                        };
                        const checkCash = (cash) => {
                            cash = +cash;
                            const invalid = isNaN(Number(cash)) || getFloatNum(cash) > 2 || cash <= 0;
                            return !invalid;
                        };
                        return carItem.decorateList.every((item) => {
                            if (!item.interiorColor || !item.appearanceColor) {
                                this.$som.toast.text('请选择外观/内饰');
                                return false;
                            }
                            if (!checkCash(Number(item.quantity)) || !Number.isInteger(Number(item.quantity))) {
                                this.$som.toast.text('请输入正确的车辆数量');
                                return false;
                            }
                            if (!checkCash(Number(item.contractPrice))) {
                                this.$som.toast.text('请输入正确的购车单价');
                                return false;
                            }
                            if (+item.quantity > 200) {
                                this.$som.toast.text('车辆数量不能大于200');
                                return false;
                            }
                            return true;
                        });
                    }
                    return true;
                });
            },
            addCar() {
                if (this.orderDetailCarInfo.length >= 50) {
                    return this.$som.toast.text('最多只能添加50条');
                }
                this.$som.loading.show({
                    text: '加载中'
                });
                this.orderDetailCarInfo.push(JSON.parse(JSON.stringify(carModel)));
                this.$nextTick(() => {
                    document.documentElement.scrollTop = document.documentElement.scrollHeight;
                    document.body.scrollTop = document.body.scrollHeight;
                    setTimeout(() => {
                        this.$som.loading.hide();
                    }, 500);
                });
            },
            addItem(carIndex) {
                this.orderDetailCarInfo[carIndex].decorateList.push({...decorateModel});
                this.$forceUpdate(); // 数据层次太多，render函数没有自动更新，需手动强制刷新
            },
            deleteItem(index, decorateList) {
                decorateList.length >= 2 && decorateList.splice(index, 1);
            },
            changeDecorateItem(decorateItem, key, val) {
                decorateItem[key] = val;
                this.$forceUpdate();
            },
            deleteCar(index) {
                if (this.orderDetailCarInfo.length === 1) return;
                this.currentCarIndex = index;
                this.showDeleteModal = true;
            }
        }
    };
</script>

<style lang="less">
    .pg-add-car {
        margin-bottom: 68px;
        ::-webkit-scrollbar { display: none; }
        .co-form-item-title {
            line-height: 22px;
            p{
                font-size: 16px;
            }
        }
        .co-form-item-content {
            .main-content {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }
        }
        .car-selector {
            z-index: 10;
        }
    }
</style>
