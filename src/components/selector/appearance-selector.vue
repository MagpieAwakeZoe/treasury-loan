<template>
    <div v-show="value" class="appearance-interior">
        <title-bar @leftBarEvent="closeComponent" :isLeftEventDefault="false">{{title}}</title-bar>
        <div ref="appearance" class="appearance pop-wrap">
            <span class="sub-title gray-bg">外观颜色</span>
            <ul>
                <li
                    v-for="(item,index) in appearanceData"
                    :key="index + item.colorValue"
                    :class="{'selected-color': appearanceActiveIndex === index}"
                    @click.stop="outerSelected(item, index)"
                    class="item-style">{{item.colorName}}</li>
            </ul>
        </div>
        <div ref="interior" class="interior pop-wrap">
            <h6>{{(selectData.appearance && selectData.appearance.colorName) || ''}}</h6>
            <span class="sub-title gray-bg">内饰颜色</span>
            <ul>
                <li
                    v-for="(item,index) in interiorData"
                    :key="index + item.colorValue"
                    :class="{'selected-color': interiorActiveIndex === index}"
                    @click.stop="innerSelected(item, index)"
                    class="item-style">{{item.colorName}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import comCommonFunc from '@/mixins/com-common-func';

const originDataStr = JSON.stringify({
    selectData: {
        appearance: {},
        interior: {}
    },
    // 外观 活跃index
    appearanceActiveIndex: -1,
    // 内饰 活跃index
    interiorActiveIndex: -1,
    appearanceData: [],
    interiorData: []
});

// 外观/内饰
export default {
    name: 'appearanceSelector',
    mixins: [comCommonFunc],
    data() {
        return JSON.parse(originDataStr);
    },
    props: {
        modelCode: {
            required: true,
            default: ''
        },
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
        modelCode() {
            this.getAppearanceData();
        }
    },
    methods: {
        reloadData() {
            this.openComponent();
            const originData = JSON.parse(originDataStr);
            Object.keys(originData).forEach((key) => {
                this[key] = originData[key];
            });
            this.title = '选择外观/内饰';
            setTimeout(() => this.setTranslate(this.$refs.appearance, 0));
            this.setTranslate(this.$refs.interior, '100%');
            this.getAppearanceData();
        },
        getAppearanceData() {
            if (this.modelCode) {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc
                    .v1_carApi_getCarModelByCode({
                        modelCode: this.modelCode
                    })
                    .then(({ appearanceColors, interiorColors }) => {
                        this.appearanceData = appearanceColors;
                        this.interiorData = interiorColors;
                    });
            }
        },
        setTranslate(elem, x) {
            this.setStyle(elem, 'transform', `translate3d(${x}, 0, 0)`);
        },
        setStyle(elem, prop, val) {
            if (!elem) {
                return;
            }
            ['webkit', 'Moz', 'O', 'ms'].forEach((prefix) => {
                elem.style[
                    prefix + prop.charAt(0).toUpperCase() + prop.substring(1)
                ] = val;
            });
            elem.style[prop] = val;
        },
        outerSelected(item, index) {
            this.$som.loading.show({
                text: '正在获取...'
            });
            // 延时效果,展现加载过程
            setTimeout(() => {
                this.$som.loading.hide();

                this.selectData.appearance = item;
                this.appearanceActiveIndex = index;

                this.setTranslate(this.$refs.interior, 0);
            }, 500);
        },
        innerSelected(item, index) {
            this.selectData.interior = item;
            this.interiorActiveIndex = index;

            this.closeComponent();
            this.$emit('selected', {
                interiorColorCode: this.selectData.interior.colorValue, //内饰颜色编码
                interiorColor: this.selectData.interior.colorName, // 内饰颜色
                appearanceColorCode: this.selectData.appearance.colorValue, // 外观颜色编码
                appearanceColor: this.selectData.appearance.colorName //外观颜色
            });
        }
    }
};
</script>

<style lang="less" scoped>

@black: #1a1a1a;
@fz12: 12px;
@fz16: 16px;

.appearance-interior ul li.selected-color {
    color: @blue;
}
.gray-bg {
    background: #f2f2f2;
}

.appearance-interior {
    .pop-wrap {
        position: fixed;
        z-index: 10;
        top: 0;
        right: 0;
        overflow-y: scroll;
        width: 100%;
        height: 100%;
        box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.1);
        background: #fff;
        transform: translate3d(100%, 0, 0);
        transition: transform 240ms;
        -webkit-overflow-scrolling: touch;
    }
    .sub-title {
        display: block;
        height: 28px;
        color: #666;
        font-size: @fz12;
        line-height: 28px;
    }
    .item-style {
        height: 44px;
        color: @black;
        font-size: @fz16;
        line-height: 44px;
        .border-bottom(#d9d9d9);
    }
    .appearance {
        width: 100%;
        z-index: 1;

        ul,
        span {
            padding-left: 4.27%;
        }
    }
    .interior {
        width: 82.945%;
        z-index: 2;

        h6 {
            height: 48px;
            margin: 0;
            color: @black;
            font-size: @fz16;
            line-height: 48px;
            text-align: center;
        }
        span {
            padding-left: 4.835%;
        }
        ul {
            margin-left: 4.835%;
        }
    }
}
</style>
