import React from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';

const axios = require('axios');
const randomString = require('randomstring');

class FormSection extends React.Component {
  constructor(props) {
    super(props);

    if (window.location.hash.substring(1) == '') {
      this.start_passphrase = randomString.generate(5);
    } else {
      const hash = window.location.hash.substring(1, 6);
      this.start_passphrase = hash;
    }

    this.state = {
      name: '',
      encrypted: '',
      message: '',
      expiration: '',
      passphrase: this.start_passphrase,
    };

    this.updateValue = (name, value) => {
      this.setState({ ...this.state, [name]: value });
      console.log(value);
    };

    this.encryptMessage = async (event) => {
      // Send a request to encrypt message
      const message = await axios
        .get(`http://localhost:3771/api?query=query%20%7B%0A%20%20encrypt(%0A%20%20%20%20passphrase%3A%20%22${this
          .state.passphrase}%22%2C%20%0A%20%20%20%20message%3A%20%22${this.state
          .message}%22%2C%0A%20%20%09name%3A%20%22${this.state
          .name}%22%2C%0A%20%20%20%20expiration%3A%20%22${this.state
          .expiration}%22%0A%20%20)%20%7B%20ciphertext%20%7D%0A%7D%0A`)
        .then((response) => {
          console.log(response);
          const data = response.data.data;
          const message = data.encrypt.ciphertext;
          console.log(message);
          return message;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(this.state.message);
      this.setState({ encrypted: message });
    };

    this.decryptMessage = async (event) => {
      // Send a request to decrypt message
      const decryptURI = `http://localhost:3771/api?query=query%20%7B%0A%20%20decrypt(%0A%20%20%20%20passphrase%3A%20%22${this
        .state.passphrase}%22%2C%20%0A%20%20%20%20ciphertext%3A%20%22${this.state
        .encrypted}%22%0A%20%20)%20%7B%20%0A%20%20%20%20message%2C%0A%20%20%20%20name%2C%0A%20%20%20%20expiration%0A%20%20%7D%0A%7D%0A`;
      const loaded = await axios
        .get(decryptURI)
        .then((response) => {
          console.log(response);
          const resp = response.data.data;
          const message = resp.decrypt;
          return message;
        })
        .catch((error) => {
          console.log(error);
        });

      this.setState({
        decrypted: loaded.message,
        expiration: new Date(loaded.expiration),
        name: loaded.name,
      });

      alert(loaded.message);
    };
  }

  render() {
    return (
      <section>
        <Input
          type="text"
          label="Name"
          name="name"
          value={this.state.name}
          onChange={this.updateValue.bind(this, 'name')}
          required
        />
        <Input
          type="text"
          multiline
          label="Message"
          name="message"
          maxLength={120}
          value={this.state.message}
          onChange={this.updateValue.bind(this, 'message')}
        />

        <DatePicker
          label="Expiration date"
          onChange={this.updateValue.bind(this, 'expiration')}
          value={this.state.expiration}
          sundayFirstDayOfWeek
        />

        {this.state.name != ''
					? <Button label="Encrypt Message" raised primary onClick={this.encryptMessage} />
					: <Button label="Encrypt Message" primary disabled onClick={this.encryptMessage} />}

        <Input
          type="text"
          label="Passphrase"
          name="passphrase"
          maxLength={5}
          value={this.state.passphrase}
          onChange={this.updateValue.bind(this, 'passphrase')}
        />

        <Input
          type="text"
          label="Encrypted"
          name="encrypted"
          value={this.state.encrypted}
          onChange={this.updateValue.bind(this, 'encrypted')}
        />
        <hr />
        {this.state.encrypted != ''
					? <Button label="Decrypt Message" onClick={this.decryptMessage} />
					: <Button label="Decrypt Message" disabled onClick={this.decryptMessage} />}
      </section>
    );
  }
}

export default FormSection;
