/**
 * Author Bhagya @ Loftux AB
 * @param record
 * @returns {string}
 */
function getRolefromNodeRecord(record) {
    //CancelCheckOut	ChangePermissions	CreateChildren	Delete	Unlock	Write
    //Collaborator     0	0	1	0	0	1
    //Contributor	   0	0	1	0	0	0
    //Consumer	       0	0	0	0	0	0
    //Manager	       0	1	1	1	0	1
    var decisionRow = "";
    decisionRow += record.jsNode.permissions.user.CancelCheckOut ? "1" : "0";
    decisionRow += record.jsNode.permissions.user.ChangePermissions ? "1" : "0";
    decisionRow += record.jsNode.permissions.user.CreateChildren ? "1" : "0";
    decisionRow += record.jsNode.permissions.user.Delete ? "1" : "0";
    decisionRow += record.jsNode.permissions.user.Unlock ? "1" : "0";
    decisionRow += record.jsNode.permissions.user.Write ? "1" : "0";

    var roleKey = "";

    switch (decisionRow) {
        case "001001":
            roleKey = "role.SiteCollaborator";
            break;
        case "001000":
            roleKey = "role.SiteContributor";
            break;
        case "000000":
            roleKey = "role.SiteConsumer";
            break;
        case "011101":
            roleKey = "role.SiteManager";
            break;
        //below are almost never available.
        case "111111":
            roleKey = "role.SiteOwner";
            break;
        default:
            roleKey = "role.SiteOther";
            break;
    }
    return Alfresco.util.message(roleKey);
}


YAHOO.Bubbling.fire("registerRenderer",
    {
        propertyName: "permissionLevelDisplay",
        renderer: function (record, label) {
            return "<span class='permission-container' for-noderef='" + record.nodeRef + "'><span class='permission-tag permission-tag-collaborator'>" + getRolefromNodeRecord(record) + "</span></span>";
        }
    });

YAHOO.Bubbling.on("cellRenderComplete", function (event, _recordNodeRef) {
//change the css for parent node;
    YAHOO.util.Dom.getElementsByClassName("permission-container").forEach(function (el) {
        if (el.getAttribute("for-noderef") == _recordNodeRef[1]) {
            //execute node styling
            Dom.addClass(el.parentNode, "inline-detail");
            Dom.addClass(Dom.getFirstChild(Dom.getAncestorByClassName(el, "yui-dt-liner")), "inline-title");
        }
    });
});

YAHOO.Bubbling.fire("registerRenderer",
    {
        propertyName: "cellRenderCompleteTrigger",
        renderer: function (record, label) {
            var imgHtml = "<img class=\"cell-render-trigger\" trigger-for-noderef=\"" + record.nodeRef + "\" style=\"display:none\" src=\"" + Alfresco.constants.URL_RESCONTEXT + "/yui/assets/skins/default/transparent.gif\" onload=\"YAHOO.Bubbling.fire('cellRenderCompleteTriggerLoaded');YAHOO.Bubbling.fire('cellRenderComplete', '" + record.nodeRef + "')\"></img>";
            return imgHtml;
        }
    });

YAHOO.Bubbling.on("cellRenderCompleteTriggerLoaded", function (event, array) {
//hide the cellrendercompletetrigger image container
    Dom.getElementsByClassName("cell-render-trigger").forEach(function (el) {
        Dom.setStyle(el.parentNode, "display", "none");
    })
});