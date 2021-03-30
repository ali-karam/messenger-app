import { makeStyles } from "@material-ui/core/styles";

const conversationPrevStyle = makeStyles(theme => ({
    card: {
       padding: '0px 10px',
       height: 75,
       marginBottom: 5,
       boxShadow: '1px 1px 2px #faf7f7'
    },
    avatar: {
        float: 'left',
        backgroundColor: theme.palette.primary.main,
        height: 47,
        width: 47,
        margin: '18px 4px',
    },
    info: {
        display: 'inline-block',
        marginLeft: 7
    },
    username: {
        textTransform: 'Capitalize',
        marginBottom: 5,
        marginTop: 22,
        fontSize: 15
    },
    lastMessage: {
        fontSize: 12,
        marginTop: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: 160
    },
    unread: {
        fontWeight: 'bold'
    },
    notification: {
        display: 'inline',
        float: 'right',
        marginTop: 40,
        marginRight: 10,
        verticalAlign: 'middle'
    }
}));

export default conversationPrevStyle;