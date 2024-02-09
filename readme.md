Astro King

1. Change node module file node_modules/@zegocloud/zego-uikit-prebuilt-call-rn/lib/commonjs/call_invitation/components/ZegoSendCallInvitationButton.js width below code

const {
<!-- icon,
    text, 
    invitees = [],
    isVideoCall = false,
    timeout = 60,
    onWillPressed,
    onPressed,
    resourceID: _resourceID = '', --> 
backgroundColor,
fontSize,
color,
width,
height,
borderRadius,
} = props;

return /_#**PURE**_/\_react.default.createElement(\_reactNative.View, {
style: styles.container
}, /_#**PURE**_/\_react.default.createElement(\_zegoUikitRn.ZegoSendInvitationButton, {
<!-- icon: icon,
    text: text, -->
backgroundColor: backgroundColor,
fontSize: fontSize,
color: color,
width: width,
height: height,
borderRadius: borderRadius,
<!-- invitees: getInviteeIDList(),
    type: isVideoCall ? _defines.ZegoInvitationType.videoCall : _defines.ZegoInvitationType.voiceCall,
    data: data,
    timeout: timeout,
    onWillPressed: onWillPressed,
    onPressed: onPress,
    resourceID: _resourceID,
    notificationTitle: _inner_text_helper.default.instance().getIncomingCallDialogTitle(localUser.userName, isVideoCall ? _defines.ZegoInvitationType.videoCall : _defines.ZegoInvitationType.voiceCall, invitees.length),
    notificationMessage: _inner_text_helper.default.instance().getIncomingCallDialogMessage(isVideoCall ? _defines.ZegoInvitationType.videoCall : _defines.ZegoInvitationType.voiceCall, invitees.length) -->
}));
}
