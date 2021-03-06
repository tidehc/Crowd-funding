$(document).on("pageInit","#user-getpassword", function(e, pageId, $page) {
	var code_timeer = null;
	var code_lefttime = 0 ;
	$(function(){
		check_submit_css(false);
		//切换
		$(".nav_item ").bind('click',function(){
			var num=$(this).attr("data");
			$(".nav_item ").each(function(i){
				box_name="box_"+i;
				$(this).removeClass("c");
				$(".box_"+i).removeClass("show");
				if(num==i){
					$(this).addClass("c");
					$(".box_"+i).addClass("show");
				}
			});
		});
		//绑定短信发送
		$("#J_send_sms_verify").bind("click",function(){
			send_mobile_verify_sms();
		});
		//点击提交表单
		$("#user_getpwd_by_mobile").find("input[name='submit_form_up_pwd']").bind("click",function(){
			do_mobile_getpassword();
		});	
	});
	//表单提交
	function do_mobile_getpassword(){
		 
		if(!check_pwd_mobile_phone()){
			$.alert(mobile_err_info);
			return false;
		}
		if(!check_register_user_pwd()){
			$.alert(user_pwd_err_info);
			return false;
		}
		if(!check_register_confirm_user_pwd()){
			$.alert(confirm_user_pwd_err_info);
			return false;
		}
		var code_val=$.trim($("#settings_mobile_code").val());
		var mobile=$.trim($("#settings-mobile").val());
		var user_pwd=$.trim($("#user_pwd").val());
		var confirm_user_pwd=$.trim($("#confirm_user_pwd").val());
		
		var sajaxurl = APP_ROOT+"/index.php?ctl=user&act=phone_update_password";
		var squery = new Object();
		squery.code = code_val;
		squery.mobile = mobile;
		squery.user_pwd = user_pwd;
		squery.confirm_user_pwd = confirm_user_pwd;
		$.ajax({
		   type: "POST",
		   dataType: "json",
		   url: sajaxurl,
		   data: squery,
		   success: function(msg){
		   		if(msg.status){
					 $.showSuccess(msg.info,function(){
					 	
					 	href = APP_ROOT+"/index.php?ctl=user&act=login";
						$.router.loadPage(href);
					 });
					 
				}else{
					 $.showErr(msg.info);
					
				}
		   }
		});
		
	}
	function check_pwd_mobile_code(){
		var code_val=$.trim($("#settings_mobile_code").val());
		var mobile=$.trim($("#settings-mobile").val());
		if(!check_pwd_mobile_phone()){
			$("#settings-mobile").focus();
				return false;
		}
		if(code_val==""){
			$.showErr("验证码不能为空");
			return false;
		}else{
			var return_val="";
			
			var sajaxurl = APP_ROOT+"/index.php?ctl=user&act=check_verify_code";
			var squery = new Object();
			squery.code = code_val;
			squery.mobile = mobile;
			$.ajax({
			   type: "POST",
			   dataType: "json",
			   url: sajaxurl,
			   data: squery,
			   success: function(msg){
			   		if(msg.status){
						$.showSuccess(msg.info);
						//form_success($("#user_getpwd_by_mobile").find("input[name='verify_coder']"),msg.info);
						check_submit_css(true);
					}else{
						$.showErr(msg.info);
						//form_error($("#user_getpwd_by_mobile").find("input[name='verify_coder']"),msg.info);
						check_submit_css(false);
						
					}
			   }
			});
			return return_val;
			
		}
	}
	function check_submit_css(status){
		if(status==true){
			$(".btn_user_register").css("background-color","#00b0f5");
			$(".btn_user_register").css("cursor","pointer");
			$(".btn_user_register").removeAttr("disabled");
		}else{
			$(".btn_user_register").css("background-color","#ccc");
			$(".btn_user_register").css("cursor","default");
			$(".btn_user_register").attr("disabled","disabled");
		}
	}
	function send_mobile_verify_sms(){
		 
		$("#J_send_sms_verify").unbind("click");
		
			var sajaxurl = APP_ROOT+"/index.php?ctl=ajax&act=send_mobie_pwd_sncode_new";
			var squery = new Object();
			squery.mobile = $.trim($("#settings-mobile").val());
			$.ajax({ 
				url: sajaxurl,
				data:squery,
				type: "POST",
				dataType: "json",
				success: function(sdata){
						
					if(sdata.status==1)
					{
						code_lefttime = 60;
						code_lefttime_func();
						$.showSuccess(sdata.info);
						return false;
					}
					else
					{
							
						$("#J_send_sms_verify").bind("click",function(){
							send_mobile_verify_sms();
						});
						$.showErr(sdata.info);
						return false;
					}
				}
			});	
	}
	function user_getpwd_by_mobile(){
		$("#user_getpwd_by_mobile").find("input[name='submit_form']").bind("click",function(){
			do_mobile_getpassword();
		});
	}

	function form_error(obj,str)
	{
		
		$(obj).parent().find(".tip_box").html("<div class='form_error'>"+str+"</div>");
	}
	function form_success(obj,str)
	{
		$(obj).parent().find(".tip_box").html("<div class='form_success'>"+str+"</div>");
	}
	//检测 密码
	var user_pwd_err_info;
	function check_register_user_pwd()
	{
		if($.trim($("#user_getpwd_by_mobile").find("input[name='user_pwd']").val())=="")
		{
			user_pwd_err_info = "请输入会员密码！";
			return false;
		}
		else if($.trim($("#user_getpwd_by_mobile").find("input[name='user_pwd']").val()).length<4)
		{
			user_pwd_err_info = "密码不得小于四位！";
			return false;
		}
		else
		{
			form_success($("#user_getpwd_by_mobile").find("input[name='user_pwd']"),"");
			return true;
		}
		
	}
	//检测确认密码
	var confirm_user_pwd_err_info;
	function check_register_confirm_user_pwd()
	{
		if($.trim($("#user_getpwd_by_mobile").find("input[name='confirm_user_pwd']").val())!=$.trim($("#user_getpwd_by_mobile").find("input[name='user_pwd']").val()))
		{
			confirm_user_pwd_err_info = "确认密码失败！";
			return false;
		}
		else
		{
			form_success($("#user_getpwd_by_mobile").find("input[name='confirm_user_pwd']"),"");
			return true;
		}
		 
	}
	//检测手机号码
	var mobile_err_info;
	function check_pwd_mobile_phone(){
		if(!$.checkMobilePhone($("#settings-mobile").val()))
		{
			mobile_err_info="手机号码格式错误！";
			return false;
		}
		
		if(!$.maxLength($("#settings-mobile").val(),11,true))
		{
			mobile_err_info="长度不能超过11位！";
			return false;
		}
		
		
		if($.trim($("#settings-mobile").val()).length == 0)
		{	
			mobile_err_info="手机号码不能为空！";	
			return false;
		}
		form_success($("#user_getpwd_by_mobile").find("input[name='mobile']"),"");
		return true;
	}
	function code_lefttime_func(){
		clearTimeout(code_timeer);
		$("#J_send_sms_verify").val(code_lefttime+"秒后重新发送");
		$("#J_send_sms_verify").css("color","#999");
		$("#J_send_sms_verify").addClass("bg_eee").removeClass("bg_red");
		code_lefttime--;
		if(code_lefttime >0){
			$("#J_send_sms_verify").attr("disabled","disabled");
			code_timeer = setTimeout(code_lefttime_func,1000);
		}
		else{
			code_lefttime = 60;
			$("#J_send_sms_verify").removeAttr("disabled");
			$("#J_send_sms_verify").val("发送验证码");
			$("#J_send_sms_verify").css("color","#fff");
			$("#J_send_sms_verify").addClass("bg_red").removeClass("bg_eee");
			$("#J_send_sms_verify").bind("click",function(){
				send_mobile_verify_sms();
			});
		}
	}
});