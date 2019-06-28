<template>
    <div v-if="value" class="open-account-bank-selector">
        <title-bar @leftBarEvent="closeComponent" :isLeftEventDefault="false">{{title}}</title-bar>
        <div class="search-box" style="margin-top: 52px;">
            <img class="search-box-icon" src="~@/assets/images/search-icon.png">
            <input
                class="search-box-input"
                type="text"
                placeholder="请输入银行名称"
                v-model.trim="searchBankWd">
        </div>
        <div class="search-result-main">
            <dl class="bank-classify" v-for="(item,index) in showSearchRes" :key="index + item.title">
                <dt>{{item.title}}</dt>
                <dd v-for="bank in item.banks" :key="bank.id" @click="selectBank(bank)">{{bank.name}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import comCommonFunc from '@/mixins/com-common-func';

const originDataStr = JSON.stringify({
    searchBankWd: '',
    hotBank: [],
    normalBank: [],
    showSearchRes: []
});
// 选择仓库
export default {
    name: 'bankSelector',
    mixins: [comCommonFunc],
    data() {
        return JSON.parse(originDataStr);
    },
    props: {
        // 显示/隐藏
        value: {
            required: true,
            type: Boolean,
            default: false
        }
    },
    watch: {
        // 重置数据
        value(val) {
            if (val) {
                this.reloadData();
            }
        },
        searchBankWd(val) {
            this.searchFunc(val.trim());
        }
    },
    methods: {
        reloadData() {
            this.openComponent();
            const originData = JSON.parse(originDataStr);
            Object.keys(originData).forEach((key) => {
                this[key] = originData[key];
            });
            this.title = '选择开户银行';

            this.$som.loading.show({
                text: '正在获取...'
            });
            Api.fsc.v1_bankApi_queryHotBank().then((res) => {
                this.hotBank = [{ title: '热门银行', banks: res }];
                this.searchFunc();
            });
            this.$som.loading.show({
                text: '正在获取...'
            });
            Api.fsc.v1_bankApi_queryUsableBank().then((res) => {
                this.normalBank = [{ title: '银行', banks: res }];
                this.searchFunc();
            });
        },
        searchFunc(val = '') {
            const sumBank = [...this.hotBank, ...this.normalBank];
            if (val === '') {
                this.showSearchRes = sumBank;
                return false;
            }
            const valSplitStr = val
                .replace(/\s/g, '')
                .split('')
                .join('.*');
            const valReg = new RegExp(valSplitStr, 'i');

            // 搜索结果
            const showSearchRes = [];
            sumBank.forEach((item) => {
                const obj = {
                    title: item.title,
                    banks: []
                };
                item.banks &&
                    item.banks.forEach((bank) => {
                        if (valReg.test(bank.name)) {
                            obj.banks.push(bank);
                        }
                    });
                obj.banks.length > 0 && showSearchRes.push(obj);
            });

            this.showSearchRes = showSearchRes;
        },
        // 选中银行
        selectBank(item) {
            this.closeComponent();
            /*
            * Desc 返回参数格式
            *
            * code  银行code  "310290000013"
            * id  银行id  834
            * name  银行名称  "浦发银行"
            *
            */
            this.$emit('selected', JSON.parse(JSON.stringify(item)));
        }
    }
};
</script>

<style lang="less" scoped>


.open-account-bank-selector {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f2f2f2;

    .search-box {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
        width: 91.47%;
        height: 30px;
        margin: 8px auto;
        padding: 0 4%;
        border-radius: 15px;
        border: 1px solid #bbb;
        background: #fff;

        .search-box-icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
        .search-box-input {
            flex: 1;
            border: none;
            height: 20px;
            line-height: 20px;
        }
    }

    .search-result-main {
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        .bank-classify {
            margin: 0;
            background: #fff;

            dt {
                height: 28px;
                padding-left: 4.27%;
                color: #666;
                font-size: 12px;
                line-height: 28px;
                background: #f2f2f2;
            }

            dd {
                display: flex;
                align-items: center;
                box-sizing: border-box;
                position: relative;
                min-height: 48px;
                padding: 12px 0;
                margin-left: 4.27%;
                color: #1a1a1a;
                font-size: 16px;
                .border-top(#d9d9d9);

                &:nth-of-type(1):before {
                    width: 0;
                    height: 0;
                }

                &:active {
                    color: @blue;
                }
            }
        }
    }
}
</style>
