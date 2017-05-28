$(function () {

   $('.top select,input').focus(function () {
       $(this).css({
           // 'outline':'1px solid #58b4db'
       })
   }).blur(function () {
       $(this).css({
           'outline':'none'
       })
   });

    $('.top input').focus(function () {
        $(this).val('')
    });

    $('#singleBtn').click(function () {
        singleBtn()
    });
    // 单次获取
    function singleBtn() {
        // getCarInfo 成功 回调 传递 参数car_id
        getCarInfo(function(car_id) {
            $('#getType').html('单次获取');
            var dateNow = dateFormat("hh:mm:ss");
            // post1 成功回调 post2
            // post2 需要post1 返回的car_id
           // getRunningInfo(car_id, dateNow, setRunningInfo);
        });
    }


    // 获取基本信息
    function getCarInfo(callback) {
        var dateNow = dateFormat("hh:mm:ss");
        var dateNowControl = dateFormat("yyyy/MM/dd hh:mm:ss");

        var plate_id = $('#plate_id').val();
        var plate_number = $('#plate_number').val();
        var company_id = $('#company_id').val();
        var device_number = $('#device_number').val();
        var cache_id = $('#cache_id').val();

        $.ajax({
            type: "post",
            url: 'https://localf.cn/api/rentalCar/carBaseInfo',
            data: {
                plate_id: plate_id,
                plate_number: plate_number,
                company_id: company_id,
                device_number: device_number,
                cache_id: cache_id
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










    // 格式化
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
});



