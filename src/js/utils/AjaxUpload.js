var AjaxHelper = {};
AjaxHelper.AjaxRequest = function (url, snd, async, onfinish, onprogress)
{
  this.req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  this.method = "POST";
  this.req.onreadystatechange = function ()
  {
    if (this.readyState == 4)
    {
      if (onfinish != null && onfinish !== undefined)
      {
        var data = null;
        try
        {
          data = JSON.parse(this.responseText);
        }
        catch (e)
        {
          data = this.responseText;
        }
        onfinish(data, this);
      }
    }
  };

  if (this.req.upload != null)
  {
    this.req.upload.onprogress = function (evt)
    {
      if (evt.lengthComputable)
      {
        if (onprogress != null && onprogress !== undefined)
        {
          onprogress(evt);
        }
      }
    }
  }

  this.Send = function ()
  {
    this.req.open(this.method, url, async);
    this.req.send(snd);
  }
}

AjaxHelper.AjaxUploadOptions = function ()
{
  this.oncomplete = null;
  this.onprogress = null;
}

AjaxHelper.AjaxUpload = function (htmlForm, requestOptions)
{
  if (htmlForm == null || htmlForm === undefined || htmlForm.nodeName === undefined || htmlForm.nodeName != "FORM")
  {
    throw "AjaxUpload: the \"htmlForm\" parameter must be a valid form element";
  }

  if (htmlForm.target === undefined)
  {
    throw "AjaxUpload: the form must have the target attribute set to a valid value";
  }

  if (requestOptions == null)
  {
    requestOptions = new Object();
  }

  if (window.FormData != undefined)
  {
    var formData = new FormData(htmlForm);

    var addr = (!!requestOptions.url) ? requestOptions.url : htmlForm.action;
    htmlForm.action = addr;
    if (!addr)
    {
      throw "The URL must be specified either as the form action or as the url field in the requestOptions object";
    }
    var aj = new AjaxHelper.AjaxRequest(addr, formData, true, requestOptions.oncomplete, requestOptions.onprogress);
    aj.Send();
    return false;
  }
  else
  {
    if (htmlForm.iframe == undefined || htmlForm.iframe == null || htmlForm.iframe.nodeName == undefined || htmlForm.iframe.nodeName != "IFRAME" || htmlForm.iframe.name != htmlForm.target)
    {
      var ifr = document.createElement("IFRAME");
      ifr.name = htmlForm.target;
      ifr.style.display = "none";
      htmlForm.iframe = ifr;
      document.body.appendChild(ifr);
      ifr.onload = function ()
      {
        if (requestOptions.oncomplete != null && requestOptions.oncomplete !== undefined)
        {
          var data = null;
          try
          {
            data = JSON.parse(this.contentDocument.body.innerHTML);
          }
          catch (e)
          {
            data = this.contentDocument.body.innerHTML;
          }
          requestOptions.oncomplete(data);
        }
      }
    }
    else
    {
      htmlForm.iframe.onload = function ()
      {
        if (requestOptions.oncomplete != null && requestOptions.oncomplete !== undefined)
        {
          requestOptions.oncomplete(this.contentDocument.body.innerHTML);
        }
      }
    }
    return true;
  }
}

/*
ajaxUploadOptions =
  {
    url: "/Path/to/uploader",
    oncomplete: function (data, xhr)
    {

    },
    onprogress: function (evt)
    {
      var percent = Math.ceil((evt.loaded / evt.total) * 100);
    }
  };
*/
AjaxHelper.registerAjaxUpload = function (htmlForm, ajaxUploadOptions)
{
  if (htmlForm == null || htmlForm === undefined || htmlForm.nodeName === undefined || htmlForm.nodeName != "FORM")
  {
    throw "registerAjaxUpload: the \"htmlForm\" parameter must be a valid form element";
  }

  htmlForm.onsubmit = function (e)
  {
    if (this != null)
    {
      return AjaxHelper.AjaxUpload(this, ajaxUploadOptions);
    }
    else
    {
      throw "submitHandler: frm is null";
    }
    return false;
  };
}
