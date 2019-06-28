<template>
    <div class="co-car-decorate">
        <div v-for="(item, index) in decorateList" class="wrapper" :key="index">
            <form-item-title :text="`第 ${index + 1} 组外观/内饰`"
                             @clickItem="deleteDecorate(index)"
                             :backgroundColor="'#fff'"
                             :color="'#666'"
                             :showRight="decorateList.length > 1"
                             :padding="'16px'">
                <img src="~@/assets/images/grey-delete.png" height="20">
            </form-item-title>
            <form-item-content :text="'外观/内饰'" :mainContent="getColor(item)"
                               @clickItem="changeDecorateColor(item, index)">
            </form-item-content>
            <form-item-content :text="'数量'">
                <input type="number" class="car-number"
                       :value="item.quantity || ''"
                       @change="changeInput(item, 'quantity', $event.target)"/>&nbsp;<b>辆</b>
            </form-item-content>
            <form-item-content :text="'购车单价'">
                <input type="number" class="car-price"
                       :value="item.contractPrice || ''"
                       @change="changeInput(item, 'contractPrice', $event.target, index)"/>&nbsp;<b>元</b>
            </form-item-content>
            <form-item-title :text="'继续添加外观/内饰'"
                             @clickItem="$emit('addItem', carIndex)"
                             class="add-item"
                             :backgroundColor="'#fff'" :color="'#508CEE'" v-if="index === decorateList.length - 1">
            </form-item-title>
        </div>
        <som-modal v-model="showModal"
                   title="确定删除外观/内饰？"
                   is-confirm
                   @on-cancel="showModal = false"
                   @on-confirm="onConfirm">
        </som-modal>

        <appearance-interior :modelCode="car.modelCode"
                             v-model="showAppearanceInterior"
                             @selected="selectedAppearanceInterior" />
    </div>
</template>

<script>
    import AppearanceInterior from '@/components/selector/appearance-selector';
    import formItemTitle from '@/components/order/form-item-title';
    import formItemContent from '@/components/order/form-item-content';

    export default {
        name: 'car-decorate',
        components: {AppearanceInterior, formItemTitle, formItemContent},
        data () {
            return {
                showModal: false,
                showAppearanceInterior: false,
                currentItemIndex: -1,
                currentItem: {},
                beenHundreded: []
            };
        },
        props: {
            decorateList: {
                type: Array,
                default: () => []
            },
            car: {
                type: Object,
                default: () => {}
            },
            carIndex: {
                type: Number,
                default: 0
            }
        },
        methods: {
            getColor(item) {
                if (item.appearanceColor) return `${item.appearanceColor} / ${item.interiorColor}`;
                return '';
            },
            changeDecorateColor(item, index) {
                if (!this.car.modelCode) {
                    this.$som.toast.text('请选择车型');
                    return false;
                }
                this.showAppearanceInterior = true;
                this.currentItemIndex = index;
                this.currentItem = item;
            },
            selectedAppearanceInterior (color) {
                for (let key in color) {
                    if ({}.hasOwnProperty.call(color, key)) {
                        this.$emit('changeDecorateItem', this.currentItem, key, color[key]);
                    }
                }
            },
            deleteDecorate(index) {
                if (this.decorateList.length > 1) {
                    this.showModal = true;
                    this.currentItemIndex = index;
                }
            },
            onConfirm() {
                this.$emit('deleteItem', this.currentItemIndex, this.decorateList);
                this.showModal = false;
            },
            changeInput(item, key, target) {
//                if (key === 'quantity') {
//                    target.value = Number(target.value).toFixed(0);
//                } else if (key === 'contractPrice' || key === 'totalDeposit') {
//                    target.value = Number(target.value * 100).toFixed(0);
//                }
                this.$emit('changeDecorateItem', item, key, +target.value);
                this.$forceUpdate();  // 避免出现*100以后template中没有/100的更新
            }
            /*handleInput (target, isInt) {
                target.value = target.value.replace(/[^\d|.]/ig, '');
                if (isInt) {
                    target.value = target.value.replace(/\D/ig, '');
                }
            }*/
        }
    };
</script>

<style lang="less">

    .co-car-decorate {
        margin: 0 16px;
        .co-form-item-content .main-content {
            max-width: calc(~'100vw - 120px - 84px');
        }
        input {
            //ios下input高度不统一
            vertical-align: middle;
            line-height: 22px;
            height: 22px;
        }
        line-height: 18px;
        .wrapper {
            background-color: #fff;
            margin: 12px 0;
            .co-form-item-title, .co-form-item-content {
                .border-bottom();
                margin-bottom: 1px;
                .main-content {
                    max-width: calc(~'100vw - 64px - 120px - 30px');
                }
                &:after {
                    left: 16px;
                }
                input.car-price {
                    color: @primary;
                }
                &.add-item {
                    text-align: center;
                    font-size: 16px;
                    &:after {
                        background-color: white;
                    }
                }
                &.totalDeposit:after {
                    left: 0;
                }
                div section {
                    input {
                        width: 100px;
                    }
                    b {
                        font-weight: normal;
                        vertical-align: middle;
                    }
                }
                &.totalDeposit div {
                    p {
                        flex: 0 0 150px;
                    }
                    section input {
                        width: 80px;
                    }
                }
            }
        }
        .appearance-interior {
            z-index: 10;
        }
    }
</style>
