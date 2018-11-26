<template>
    <section>
        <div class="calendar-operation">
            <div class="calendar_hd">
                <span class="pre" @click="preMonth" :class="{'click-pre': isClickPre}"></span>
                <div class="init-txt">
                    <span class="y">{{dataArr.curYear}}</span>
                    <span> / </span>
                    <span class="m">{{ dataArr.curMonth <= 9 ? 0 : '' }}{{dataArr.curMonth}}</span>
                </div>
                <span class="next" @click="nextMonth"></span>
            </div>
            <div class="calendar_bd">
                <ul class="week">
                    <li v-for="(item, index) in dataArr.weekArr" :key="index">
                        {{ item }}
                    </li>
                </ul>
                <ul class="days">
                    <li v-for="(item, index) in dataArr.dataWrap" :key="index" 
                        :class="[{ 'other': index < dataArr.firstDayWeek || index > dataArr.lastDayWeek }, {'today': item.isToday}, {'select-day': item.isCheck}]"
                        @click="choiceDay(index)"
                    >
                        {{ item.ind }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            dataArr: {
                weekArr: ['日', '一', '二', '三', '四', '五', '六'],
                dataWrap: [],
                curYear: new Date().getFullYear(),
                curMonth: new Date().getMonth() + 1,
                curDay: new Date().getDate(),
                firstDayWeek: 0,
                lastDayWeek: 0,
                monthNowLength: 0
            },
            isClickPre: false,
            hasCheckInArr: ['2018-11-10', '2018-11-41', '2019-1-1']
        }
    },
    methods: {
        choiceDay(i) {
            const clickYear = this.dataArr.curYear;
            const clickMonth = this.dataArr.curMonth;
            const clickDay = i - this.dataArr.firstDayWeek + 1;
            const checkItem = `${clickYear}-${clickMonth}-${clickDay}`;
            if (i - this.dataArr.firstDayWeek + 1 <= this.dataArr.monthNowLength && i - this.dataArr.firstDayWeek + 1 > 0) {
                if (this.hasCheckInArr.indexOf(checkItem) === -1) {
                    this.hasCheckInArr.push(checkItem)
                } else {
                    this.hasCheckInArr.splice(this.hasCheckInArr.indexOf(checkItem), 1);
                }
                this.initCalendar(this.dataArr.curYear, this.dataArr.curMonth - 1);
            }
        },
        queryAlreadyChosen(year, month, day) {
            const newStr = `${year}-${month}-${day}`;
            if (this.hasCheckInArr.indexOf(newStr) !== -1) {
                return true;
            } else {
                return false;
            }
        },
        // 获取该月第一天对应的星期几
        getFirstDayOfWeek(year, month) {
            const firstDayWeek = new Date(year, month, 1).getDay();
            return firstDayWeek;
        },
        // 获取该月最后一天的日期
        getLastDayOfDate(year, month) {
            const lastDayDate = new Date(year, month, 0).getDate();
            return lastDayDate;
        },
        // 获取该月最后一天对应的星期几
        getLastDayOfWeek(year, month) {
            const lastDayWeek = new Date(year, month, 0).getDay();
            return lastDayWeek;
        },
        // 获取上一个月最后一天的日期
        getLastDayOfPrevDate(year, month) {
            const lastDayPrevDate = new Date(year, month, 0).getDate();
            return lastDayPrevDate;
        },
        initCalendar(year, month) {
            let dataWrap = [];
            let count = 0;
            let temp = {};
            const curYear = year;// 当前的年份
            const curMonth = month + 1;// 当前的月份
            const firstDayWeek = this.getFirstDayOfWeek(curYear, curMonth - 1);// 该月第一天对应的星期几
            const lastDayDate = this.getLastDayOfDate(curYear, curMonth);// 该月最后一天的日期
            const lastDayWeek = this.getLastDayOfWeek(curYear, curMonth);// 该月最后一天对应的星期几
            const lastDayPrevDate = this.getLastDayOfPrevDate(curYear, curMonth - 1);// 上一个月最后一天的日期
            // 上一个月
            for (let i = 0; i < firstDayWeek; i++) {
                temp = {};
                temp['ind'] = lastDayPrevDate - firstDayWeek + i + 1;
                temp['isCheck'] = false;
                temp['isToday'] = false;
                dataWrap[count] = temp;
                count++;
            }
            // 当前月
            for (let i = 0; i < lastDayDate; i++) {
                temp = {};
                temp['ind'] = i + 1;
                const dayCount = count - firstDayWeek + 1;
                if (this.queryAlreadyChosen(curYear + '', curMonth + '', dayCount + '')) {
                    temp['isCheck'] = true;
                } else {
                    temp['isCheck'] = false;
                }

                if (curYear === new Date().getFullYear() && curMonth === new Date().getMonth() + 1 && i === new Date().getDate() - 1) {
                    temp['isToday'] = true
                } else {
                    temp['isToday'] = false;
                }
                dataWrap[count] = temp;
                count++;
            }
            // 下一个月
            for (let i = 0; i < (7 - lastDayWeek - 1); i++) {
                temp = {};
                temp['ind'] = i + 1;
                temp['isCheck'] = false;
                temp['isToday'] = false;
                dataWrap[count] = temp;
                count++;
            }
            this.dataArr.lastDayWeek = firstDayWeek + lastDayDate - 1;
            this.dataArr.monthNowLength = lastDayDate;
            this.dataArr.firstDayWeek = firstDayWeek;
            this.dataArr.dataWrap = dataWrap;
        },
        preMonth() {
            if (this.dataArr.curMonth - 1 === new Date().getMonth() + 1 && this.dataArr.curYear === new Date().getFullYear()) {
                this.isClickPre = false;
            }
            if (this.dataArr.curMonth - 1 < new Date().getMonth() + 1 && this.dataArr.curYear === new Date().getFullYear()) {
                return;
            }
            this.dataArr.curMonth = this.dataArr.curMonth - 1;
            if (this.dataArr.curMonth < 1) {
                this.dataArr.curMonth = 12;
                this.dataArr.curYear = this.dataArr.curYear - 1;
            }
            this.initCalendar(this.dataArr.curYear, this.dataArr.curMonth - 1);
        },
        nextMonth() {
            this.dataArr.curMonth = this.dataArr.curMonth + 1;
            if (this.dataArr.curMonth > 12) {
                this.dataArr.curMonth = 1;
                this.dataArr.curYear = this.dataArr.curYear + 1;
            }
            this.isClickPre = true;
            this.initCalendar(this.dataArr.curYear, this.dataArr.curMonth - 1);
        }
    },
    created() {
        this.initCalendar(this.dataArr.curYear, this.dataArr.curMonth - 1);
    }
}
</script>

<style scoped lang="scss">
.calendar-operation {
    position: relative;
    width: 100%;
    height: 290px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #aaa;
    padding: 10px 5px;
    .calendar_hd {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;
        .pre, .next {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 30px;
            padding: 0;
            border: 1px solid transparent;
            border-radius: 2px;
            color: #F86380;
            font: 0/0 Arial;
            text-decoration: none;
            outline: 0;
            margin-right: 10px;
        }
        .next {
            margin-left: 10px;
        }
        .pre:after, .next::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            margin: -6px 0 0 -5px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            font: 0/0 Arial;
        }
        .pre:after {
            border-right: 10px solid #ccd1d9;
        }
        .click-pre:after {
            border-right: 10px solid #F86380;
        }
        .next:after {
            border-left: 10px solid #F86380;
        }
        .init-txt {
            position: relative;
            font-size: 16px;
            font-weight: 700;
            top: -1px;
        }
    }
    .calendar_bd {
        .week, .days {
            display: flex;
            flex-wrap: wrap;
            margin-top: 2px;
            li {
                display: flex;
                width: 14%;
                justify-content: center;
                align-items: center;
            }
        }
        .week {
            li {
                color: #999;
            }
        }
        .days {
            li {
                height: 32px;
                border: 2px solid #fff;
                border-radius: 10px;
            }
            .other {
                color: #ccd1d9;
            }
            .select-day {
                color: #fff !important;
                background-color: #F86380;
            }
            .today {
                color: #F86380;
            }
        }
    }
}
</style>
