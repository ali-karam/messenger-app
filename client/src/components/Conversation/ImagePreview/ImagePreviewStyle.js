import { makeStyles } from '@material-ui/core/styles';

const imagePreviewStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'rgba(82, 84, 83, 0.3)',
    outline: 'none',
    margin: 'auto',
    marginTop: 20,
    width: '90%',
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '16px',
    position: 'relative'
  },
  img: {
    maxWidth: '95%',
    maxHeight: '95%',
    borderRadius: '4.8px'
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  closeIcon: {
    height: 30,
    width: 30,
    color: '#343635'
  }
}));

export default imagePreviewStyle;
