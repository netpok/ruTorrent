plugin.loadLang();

if(plugin.enabled && plugin.canChangeOptions())
{
	plugin.accaddAndShowSettings = theWebUI.addAndShowSettings;
	theWebUI.addAndShowSettings = function(arg) 
	{
		if(plugin.enabled)
		{
			$.each( theWebUI.theAccounts, function(name,val)
			{
				$('#'+name+'_lmenabled').attr("checked", (val.enabled==1));
				$('#'+name+'_lmlogin').val(val.login);
				$('#'+name+'_lmpassword').val(val.password);
				$('#'+name+'_lmenabled').change();
			});
		}
		plugin.accaddAndShowSettings.call(theWebUI,arg);
	}

	plugin.accWasChanged = function() 
	{
		var ret = false;
		$.each( theWebUI.theAccounts, function(name,val)
		{
			if( ($('#'+name+'_lmenabled').attr("checked") ^ val.enabled) ||
				($('#'+name+'_lmlogin').val()!=val.login) ||
				($('#'+name+'_lmpassword').val()!=val.password))
			{
				ret = true;
				return(false);
			}
		});
		return(ret);
	}

	plugin.accSettings = theWebUI.setSettings;
	theWebUI.setSettings = function() 
	{
		plugin.accSettings.call(this);
		if(plugin.enabled && plugin.accWasChanged())
			this.request("?action=setacc");
	}

	rTorrentStub.prototype.setacc = function()
	{
		var s = '';
		$.each( theWebUI.theAccounts, function(name,val)
		{
			s+=("&"+name+"_enabled="+($('#'+name+'_lmenabled').attr("checked") ? 1 : 0)+
				"&"+name+"_login="+encodeURIComponent($.trim($('#'+name+'_lmlogin').val()))+
				"&"+name+"_password="+encodeURIComponent($.trim($('#'+name+'_lmpassword').val())));
		});
		this.content = "mode=set"+s;
	        this.contentType = "application/x-www-form-urlencoded";
		this.mountPoint = "plugins/loginmgr/action.php";
		this.dataType = "script";
	}
}

plugin.onLangLoaded = function()
{
	var s = '';
	$.each( theWebUI.theAccounts, function(name,val)
	{
		s+="<fieldset>"+
			"<legend>"+name+"</legend>"+
			"<table>"+
				"<tr>"+
					"<td><input type='checkbox' id='"+name+"_lmenabled' onchange=\"linked(this, 0, ['"+name+"_lmlogin','"+name+"_lmpassword']);\"/><label for='"+name+"_enabled' id='lbl_"+name+"_lmenabled'>"+theUILang.Enabled+"</label></td>"+
				"</tr>"+
				"<tr>"+
					"<td><label id='lbl_"+name+"_lmlogin' for='"+name+"_lmlogin' class='disabled'>"+theUILang.accLogin+":</label></td>"+
					"<td class=\"alr\"><input type='text' id='"+name+"_lmlogin' class='TextboxLarge' maxlength='32' disabled='true' /></td>"+
				"</tr>"+
				"<tr>"+
					"<td><label id='lbl_"+name+"_lmpassword' for='"+name+"_lmpassword' class='disabled'>"+theUILang.accPassword+":</label></td>"+
					"<td class=\"alr\"><input type='password' id='"+name+"_lmpassword' class='TextboxLarge' maxlength='32' disabled='true' /></td>"+
				"</tr>"+
			"</table>"+
		"</fieldset>";
	});
	this.attachPageToOptions($("<div>").attr("id","st_loginmgr").html(s)[0],theUILang.accAccounts);
}

plugin.onRemove = function()
{
	this.removePageFromOptions("st_loginmgr");
}