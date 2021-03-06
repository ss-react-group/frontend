import * as React from 'react';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as Autosuggest from 'react-autosuggest';
import { Fetch } from '../../helpers/fetch';
import { env } from '../../env';
import { ITweet } from '../../interfaces';
import './Search.scss';

interface ISearchProps {
  stores?: any;
}

interface ISearchState {
  value: string;
  suggestions: any;
  tweets: any;
}

@inject('stores')
@observer
export class Search extends Component<ISearchProps, ISearchState> {
  constructor(props: ISearchProps) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      tweets: []
    };
  }

  getSuggestionValue = (suggestion: any) => {
    let chosenTweet = this.props.stores.tweetsStore.tweets.find((item: ITweet) => item.id === suggestion.id);
    this.props.stores.TweetModalStore.isOpen = true;
    this.props.stores.TweetModalStore.selectedTweet = chosenTweet;
    return suggestion.name;
  };

  renderSuggestion = (suggestion: any) => <div>{suggestion.name}</div>;

  getSuggestions = (value: any) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { tweets } = this.state;

    return inputLength === 0
      ? []
      : tweets.filter((lang: any) =>
          lang.name.toLowerCase().includes(inputValue)
        );
  };

  onChange = (event: any, { newValue }: { newValue: any }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = async ({
    value,
    reason
  }: {
    value: any;
    reason: any;
  }) => {
      const response = await Fetch.request(env.securedRoutes + '/posts', 'json', { method: 'GET' });
      this.props.stores.tweetsStore.tweets = response;
      const { tweets } = this.props.stores.tweetsStore;
      const readableTweets = tweets.map((item: ITweet) => ({
        name: item.content,
        id: item.id
      }));
      this.setState({
        tweets: readableTweets
      });
      this.setState({
        suggestions: this.getSuggestions(value)
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search posts...',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
