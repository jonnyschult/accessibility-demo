import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from '@emotion/native';
import {CustomButton} from '../shared/reusableComponents/Button';
import DropDownInput from '../shared/reusableComponents/DropDownMenu';
import FormErrorMessage from '../shared/reusableComponents/FormErrorMessage';
import Input from '../shared/reusableComponents/Input';
import SuccessModal from './SuccessModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../RootNavigator';
import {useAccessibilityContext} from '../shared/accessibilityContext';

interface FormErrors {
  series: string;
  character: string;
  episode: string;
}

interface Props extends NativeStackScreenProps<RootStackParams, 'Form'> {}

const Form = ({navigation}: Props) => {
  const {setFocus} = useAccessibilityContext();
  const headerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [series, setSeries] = useState('');
  const [character, setCharacter] = useState('');
  const [episode, setEpisode] = useState('');
  // My attempt to mimic most form library validation methods
  const [errors, setErrors] = useState<FormErrors>({
    series: '',
    character: '',
    episode: '',
  });
  const bestBBCMysteries = [
    'Sherlock',
    'Grantchester',
    'Endeavour',
    'Father Brown',
    'Broadchurch',
    'Luther',
  ];

  const validateForm = async () => {
    let isValid = true;
    let updatedErrors: FormErrors = {
      series: series ? '' : 'Series selection is required',
      episode: episode ? '' : 'Please enter an episode number or name',
      character: character ? '' : 'Please enter a character name',
    };
    if (
      updatedErrors.character ||
      updatedErrors.episode ||
      updatedErrors.series
    ) {
      isValid = false;
    }
    await setTimeout(() => {}, 500);
    setErrors(updatedErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setErrors({series: '', character: '', episode: ''});
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    await setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 5000);
  };

  useEffect(() => {
    if (headerRef) {
      setFocus(headerRef, 500);
    }
  }, [headerRef, setFocus]);

  return (
    <Layout contentContainerStyle={contentContainerStyle}>
      <SuccessModal
        visible={showModal}
        handleClose={() => {
          setShowModal(false);
          navigation.navigate('AccessibilityMenu');
        }}
      />
      <FormContainer>
        <FormHeader accessibilityRole="header" ref={headerRef}>
          BEST BBC MYSTERIES
        </FormHeader>

        <DropDownInput
          defaultText="Select a Mystery Series"
          dropDownOptions={bestBBCMysteries}
          selection={series}
          accessibilityLabel="Mysteries Dropdown Menu"
          scrollEnabled={false}
          error={Boolean(errors.series)}
          setSelection={selectedValue => {
            setErrors({...errors, series: ''});
            setSeries(selectedValue);
          }}
        />

        <FormErrorMessage
          errorMessage={errors.series}
          isVisible={Boolean(errors.series)}
        />

        <Input
          marginBottom={26}
          multiline
          label="Who's your favorite character?"
          activeLabel="Favorite Character"
          value={character}
          labelHeight={14}
          onChangeText={setCharacter}
          editable={!isLoading}
          error={Boolean(errors.character)}
          errorMessage={errors.character}
        />

        <Input
          marginBottom={26}
          multiline
          label="Which episode is your favorite?"
          activeLabel="Favorite Episode"
          value={episode}
          labelHeight={14}
          onChangeText={setEpisode}
          editable={!isLoading}
          error={Boolean(errors.episode)}
          errorMessage={errors.episode}
        />

        <CustomButton
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={isLoading}>
          SUBMIT
        </CustomButton>
      </FormContainer>
    </Layout>
  );
};

export default Form;

const contentContainerStyle = css({
  alignItems: 'center',
});

const Layout = styled.ScrollView({
  flex: 1,
});

const FormContainer = styled.View({
  width: '70%',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const FormHeader = styled.Text({
  marginTop: 30,
  marginBottom: 25,
  fontSize: 20,
  color: 'black',
});
