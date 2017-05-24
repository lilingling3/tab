var rentalCar_location_ref=/^\/admin\/rentalcar\/carinfo/;
if(rentalCar_location_ref.test(window.location.pathname)) {
    // 定时器
    var timer;
    // 布尔值 是否连续获取
    var flag = true;
    // 循环时间
    var TIME = 30000;

    // 日期格式化
    /**
     * [dateFormat description]
     * @param  {[type]} dateFormatStr [description]
     * @return {[type]}               [description]
     */

    function dateFormat(dateFormatStr) {

        Date.prototype.Format = function(fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };

            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        return new Date().Format(dateFormatStr);

    }

    /**
     * [singleBtn description]
     * @return {[type]} [description]
     */

// 单次获取
    function singleBtn() {
        // getCarInfo 成功 回调 传递 参数car_id
        getCarInfo(function(car_id) {
            $('#getType').html('单次获取');
            var dateNow = dateFormat("hh:mm:ss");
            // post1 成功回调 post2
            // post2 需要post1 返回的car_id
            getRunningInfo(car_id, dateNow, setRunningInfo);
        });
    }

    /**
     * [repeatCallback description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
// 连续获取 post2 回调
    function repeatCallback(data) {
        setHistory();
        setRunningInfo(data);
    }

    /**
     * [repeatBtn description]
     * @return {[type]} [description]
     */
// 连续获取
    function repeatBtn() {
        if (flag) {
            flag = false;
            $('#CarInfo2').html('暂停获取');

            getCarInfo(function(car_id) {
                $('#getType').html('连续获取');

                var dateNow = dateFormat("hh:mm:ss");

                timer = setInterval(function() {
                    getRunningInfo(car_id, dateNow, repeatCallback);
                }, TIME);

            });
        } else {
            stopBtn();
        }
    }
    // 暂停获取
    function stopBtn() {
        clearInterval(timer);
        $('#CarInfo2').html('连续获取');
        flag = true;
    }

    function getRunningInfoByTime(dateTime) {
        var car_id = $('#car_id').val();

        // 先暂停获取
        stopBtn();
        // 再发送请求
        getRunningInfo(car_id, dateTime, setRunningInfo);
    }

    /**
     * [getCarInfo description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
// post1 请求 获取基本信息
    function getCarInfo(callback) {

        var dateNow = dateFormat("hh:mm:ss");
        var dateNowControl = dateFormat("yyyy/MM/dd hh:mm:ss");

        var plate_id = $('#plate_id').val();
        var plate_number = $('#plate_number').val();
        var company_id = $('#company_id').val();
        var device_number = $('#device_number').val();

        $.ajax({
            type: "post",
            url: '/admin/rentalcar/carBaseInfo',
            data: {
                plate_id: plate_id,
                plate_number: plate_number,
                company_id: company_id,
                device_number: device_number
            },
            dataType: "json",
            success: function(data) {
                if (data.errorCode == 0) {
                    // 初始化 running_fields
                    initRunningField(data.running_fields);
                    // operate_fields 调用函数形式 初始化页面
                    initCarControl(data.operate_fields);

                    // 车辆基本信息
                    $('#carBrand').html(data.plate_place + "" + data.plate_number);

                    $('#carModel').html(data.models);

                    if (data.order_status == 300) {
                        $('#carStatus').html('未出租');
                    } else if (data.order_status == 301) {
                        $('#carStatus').html('已出租');
                    } else {
                        $('#carStatus').html('未知').addClass('red');
                    }

                    $('#carDevice').html(data.device);

                    $('#carDeviceID').html(data.device_number);

                    $('#getTime').html(dateNow);

                    $('#controlTime').html(dateNowControl);

                    // 保存car_id
                    $('#car_id').val(data.car_id);

                    // 成功之后  回调  传递 car_id
                    // 第二个post 请求需要 第一个post 请求返回的数据
                    callback(data.car_id);

                } else {
                    console.log("获取失败");
                }
            }
        });
    }


    function initCarControl(control_fields) {
        for (var k in control_fields) {
            if (control_fields[k] == 0) {
                $('#car_control_' + k).html('未提供')
                    .addClass('red link-disabled')

            } else if (control_fields[k] == 1) {
                var dataValue = $('#car_control_' + k).attr('data-value');
                $('#car_control_' + k).html(dataValue).removeClass('red');
            }
        }
    }

    function initRunningField(running_fields){
        for (var k in running_fields){
            if(running_fields[k] == 0){
                $('#' + k).html('未提供').addClass('red');
            }
        }
    }

    /**
     * [getRunningInfo description]
     * @param  {[type]}   car_id   [description]
     * @param  {[type]}   dateTime [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
// post2 请求，获取runningInfo
    function getRunningInfo(car_id, dateTime, callback) {

        $.ajax({
            type: "post",
            url: '/admin/rentalcar/carRunningInfo',
            data: {
                car_id: car_id,
                time: dateTime
            },
            dataType: "json",
            success: function(data) {
                callback(data);
            }

        });
    };

    // 设置 runningInfo
    // getRunningInfo 成功之后的回调
    function setRunningInfo(data) {
        var result = data.data;
        if (data.errorCode == 0) {
            //console.log(result);
            $('#location').html(result.longitude + ',' + result.latitude);
            $('#elevation').html(result.elevation);
            $('#speed').html(result.speed);
            $('#direction').html(result.direction);
            $('#distance').html(result.distance);
            $('#surplusDistance').html(result.surplusDistance);
            $('#surplusPercent').html(result.surplusPercent);
            $('#light').html(result.light);
            $('#door').html(result.door);
            $('#voltage').html(result.voltage);
            $('#acc').html(result.acc);
            $('#signal').html(result.signal);
            $('#status').html(result.status);

            $('#map').attr("href", "/admin/rentalcar/map?latitude=+" + result.latitude + "&longitude=" + result.longitude);

        } else if(data.errorCode == -1){
            alert(data.errorMessage);
        }
    }

    /**
     * [setHistory description]
     */
// 连续获取 显示历史
    function setHistory() {
        var dateTime = dateFormat("hh:mm:ss");

        var $repeateHistory = $('#repeateHistory');

        $('#repeateSpan').css({
            display: 'block'
        });

        var links = '';
        links += '<span><a style="font-size: 16px" onclick="getRunningInfoByTime(\'' + dateTime + '\')">' + dateTime + '</a>|</span>';

        var length = $repeateHistory.children('span').length;

        if (length >= 15) {
            $repeateHistory.children('span').first().remove();
        }

        $repeateHistory.append(links);
    }

    // post3
    function getCarControl(type) {

        var dateNow = dateFormat("hh:mm:ss");

        var car_id = $('#car_id').val();

        $.ajax({
            type: "post",
            url: '/admin/rentalcar/carControl',
            data: {
                car_id: car_id,
                operate: type
            },
            dataType: "json",
            success: function(data) {
                console.log(data);

                if (data.errorCode == 0) {
                    if (data.data) {
                        $('#car_control_' + type + '_time').html(dateNow)
                        $('#car_control_' + type + '_result').html('成功')
                    } else {
                        $('#car_control_' + type + '_time').html(dateNow)
                        $('#car_control_' + type + '_result').html('失败')
                    }
                } else {
                    console.log("3获取失败");
                }
            }
        })

    }
}