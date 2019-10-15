// 模块化编程思想---本质上是闭包
var module=(function(){
    // 变量的初始化
    var task_list=[];//定义了一个空数组---用来存放每一条数据
    var $ipt,$addTaskBtn,$task_list,$task_detail,$detail_content,$desc,$datetime,$detail_submit;
    var detailIndex,deleteIndex;
    // 第一步---初始化jq对象
    var initIqVar=function(){
        $ipt=$('.ipt');
        $addTaskBtn=$('.addTaskBtn');
        $task_list=$('.task-list');
        $task_detail=$('.task-detail');
        $detail_content=$('.detail-content');
        $desc=$('.desc');
        $datetime=$('.datetime');
        $detail_submit=$('.detail-submit');

    }
    // 初始化页面的每一条task-item，从store.js小型数据库中取出，渲染到页面上
    var initRenderIndex=function(){
        // 首先要清空列表
        $task_list.html('');
        // 然后取出每一条数据----所有数据存放在空数组中
        task_list=store.get('task_list');
        var renderHtmlStr='';
        for(var i=task_list.length-1;i>=0;i--){
            var oneItem='<div class="task-item">'+
				'<span class="chebk">'+
					'<input type="checkbox">'+
				'</span>'+
				'<span class="item-content">'+task_list[i].content+
				'</span>'+
                '<span class="action detail">'+
                '详情'+
                '</span>'+
                '<span class="action delete">'+
               ' 删除'+
              ' </span>'+
            '</div>';
            renderHtmlStr+=oneItem;
        }
        $(renderHtmlStr).appendTo($task_list);
        listenDetail();
        listenDelete();
    }
    // 添加的内容
    var addTask=function(){
        var new_task={};//创建新的对象
        new_task.content=$ipt.val();
        task_list.push(new_task);//更新了数组----此时数组发生了改变
        // 每次数组进行增删改的时候，我们都需要保存一下数组中的每一条数据
        store.set('task_list',task_list);//存储数据的过程
        newRenderTask(new_task);
    }
    // 新增加的数据
    var newRenderTask=function(new_task){
        var oneItem='<div class="task-item">'+
        '<span class="chebk">'+
            '<input type="checkbox">'+
        '</span>'+
        '<span class="item-content">'+new_task.content+
        '</span>'+
        '<span class="action detail">'+
        '详情'+
        '</span>'+
        '<span class="action delete">'+
       ' 删除'+
      ' </span>'+
        '</div>';
        $(oneItem).prependTo($task_list);
        $ipt.val('');
        listenDetail();
        listenDelete();
    }
    // 给submit加绑定事件
    var listenBtn=function(){
        $addTaskBtn.click(function(){
            addTask();
        })
    }
    // 点击详情弹出编辑界面
    var listenDetail=function(){
        $('.detail').click(function(){
            $task_detail.show();
            // 首先要获取详情每一条数据的编号
            detailIndex=task_list.length-1-$(this).parent().index();
            $detail_content.val(task_list[detailIndex].content);
            $desc.val(task_list[detailIndex].desc);
            $datetime.val(task_list[detailIndex].datetime);
        })
    }
    // 点击提交
    var listenSave=function(){
        $detail_submit.click(function(){
            // 首先创建一个新的对象
            var dataTask={};
            dataTask.content=$detail_content.val();
            dataTask.desc= $desc.val();
            dataTask.datetimet=$datetime.val();
            // 新创建的数据和原有的要进行合并
            // jq合并方法---extend
            // 用法:
            // $.extend(json1,json2);
            task_list[detailIndex]= $.extend(task_list[detailIndex],dataTask);
            // 数据库进行了合并过程---本质上就是修改了数据库---存储数据
            store.set('task_list',task_list);//存储数据的过程
            $task_detail.hide();
            initRenderIndex();
        })
    }
    // 删除每一条数据
    var listenDelete=function(){
        $('.delete').click(function(){
              // 首先要获取删除的每一条数据的索引值
              deleteIndex=task_list.length-1-$(this).parent().index();
              var r=confirm('确认删除么？真的确定删除？');
              if(r){
                  task_list.splice(deleteIndex,1);
                  $(this).parent().remove();
              }
            })
    }
    // 初始化页面的所有方法都放在initModule里
    var initModule=function(){
        // store.set('task_list',task_list);
        initIqVar();
        initRenderIndex();
        listenBtn();
        listenDetail();
        $datetime.datetimepicker();
        listenSave();
        listenDelete();
    }
    return{
        initModule:initModule
    }
})()

$(function(){
    module.initModule();
})