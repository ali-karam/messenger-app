import { useField } from "formik";
import { TextField, Typography } from "@material-ui/core";
import validatedTextFieldStyle from './ValidatedTextFieldStyle';

const ValidatedTextField = ({id, label, forgotOption, ...props}) => {
    const classes = validatedTextFieldStyle();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const inputProps = {
      classes: { input: classes.inputs }
    }

    if(forgotOption) {
      inputProps.endAdornment = (
        <Typography className={classes.forgot}>
          Forgot?
        </Typography>
      )
    }
    
    return (
      <TextField 
        {...field} 
        helperText={errorText} 
        label={
          <Typography className={classes.label}>
            {label}
          </Typography>
        }
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        InputProps={inputProps}
        id={field.name}
        error={Boolean(errorText)}
        {...props}
      />
    );
};

export default ValidatedTextField;