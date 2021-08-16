$(document).ready(function() {
    var regex = /^(\d{4}[-]\d{2}[-]\d{2})/gm;
    var aftertoday = [];
    var beforeToday = [];
    var thismonthDays = [];
    var finalSort = [];
    var today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    $.ajax({
        url: "http://interview.dev.steinias.com/api/employees",
        type: "GET",
        asyn: false,
        beforeSend: function() {},
        success: function(result) {
            $.each(result, function(index) {
                $('.staffHeading span').text(result.length);
                result.sort(function(a, b) {
                    return new Date(a.birthday) - new Date(b.birthday);
                });
                var newDate = JSON.stringify(result[index].birthday.match(regex));
                result[index].newDate = newDate;
                var jsonMM = result[index].newDate.substring(7, 9);
                var jsonDD = result[index].newDate.substring(10, 12);
                var jsonYY = result[index].newDate.substring(2, 6);
                result[index].newM = jsonMM;
                result[index].finalDate = jsonMM + '-' + jsonDD + '-' + jsonYY;
                // console.log(result[index].finalDate.substring(3, 5));
                if (result[index].newM < mm) {
                    beforeToday.push(result[index]);
                    beforeToday.sort(function(a, b) {
                        return new Date(a.newM) - new Date(b.newM);
                    });
                } else {
                    if (result[index].finalDate.substring(0, 2) == mm && result[index].finalDate.substring(3, 5) <= (dd - 1)) {
                        thismonthDays.push(result[index]);
                        thismonthDays.sort(function(a, b) {
                            return new Date(b.newM) - new Date(a.newM);
                        });
                        // console.log(thismonthDays);
                    } else {
                        aftertoday.push(result[index]);
                        aftertoday.sort(function(a, b) {
                            return new Date(a.newM) - new Date(b.newM);
                        });
                    }
                }
                finalSort = aftertoday.concat(beforeToday);
                finalSort = finalSort.concat(thismonthDays);
                console.log(finalSort);
            });
            $.each(finalSort, function(index) {
                // cloning cards..
                var cloneDiv = $('#cloneCard').clone();
                cloneDiv.find('.profileInfo').attr('data', JSON.stringify(finalSort[index]));
                cloneDiv.find('.name').text(finalSort[index].name);
                cloneDiv.find('.jobTitle').text(finalSort[index].jobTitle);
                $('.allStaff').append(cloneDiv.removeClass('d-none').removeAttr('id').attr('id', 'staff_' + index));
            });
        },
        error: function() {},
        complete: function() {
            $('.allStaff .profileCard:nth-child(4n+1)').attr('data-tag', 'san');
            $('.allStaff .profileCard:nth-child(4n+2)').attr('data-tag', 'nyc');
            $('.allStaff .profileCard:nth-child(4n+3)').attr('data-tag', 'lond');
            $('.allStaff .profileCard:nth-child(4n+4)').attr('data-tag', 'man');
        },
    });
    $(document).on('click', '.allStaff .profileCard', function() {
        var getValue = $('.profileInfo', this).attr('data');
        var getTag = $(this).attr('data-tag');
        $('#staffModal').find('.modalDiv').removeAttr('data-tag');
        $('#staffModal').find('.modalDiv').attr('data-tag', getTag);
        var obj = JSON.parse(getValue);
        var test = obj.newDate.replace(/\-/g, '/');
        var date = new Date(obj.birthday);
        var dob = new Date(date);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff);
        var year = age_dt.getUTCFullYear();
        var age = Math.abs(year - 1970);
        // fetch this.data for modal
        $('#staffModal').find('.profileInfo .name').text(obj.name);
        $('#staffModal').find('.profileInfo .jobTitle').text(obj.jobTitle);
        $('#staffModal').find('.profileInfo .emailTag').text(obj.email);
        $('#staffModal').find('.profileInfo .dynamic .ageClass').text(age);
        $('#staffModal').find('.profileInfo .dynamic .month').text(monthNames[date.getMonth()]);
        $('#staffModal').find('.profileInfo .dynamic .bday').text(obj.finalDate.substring(3, 5));
        $('#staffModal').find('.profileInfo .callTag').text(obj.mobile);
        $('#staffModal').find('.profileInfo .disc p').text(obj.jobDescription);
    });
});
