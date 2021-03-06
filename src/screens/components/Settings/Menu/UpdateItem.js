import React, { Component } from "react";
import {
  Form,
  Input,
  Message,
  Segment,
  Table,
  Button,
} from "semantic-ui-react";
import Category from "./Category";
import Axios from "axios";
import { urls, errorMessages } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";
import ItemTypeLOV from "./ItemTypeLOV";

class UpdateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      loading: false,
      error: "",
      reload: false,
      oldItem: {
        itemName: "",
        itemType: "SINGLE",
        variants: [],
        price: "",
        categoryId: "",
      },
      item: {
        itemName: "",
        itemType: "SINGLE",
        variants: [],
        price: "",
        categoryId: "",
      },
      variant: {
        variantName: "",
        price: "",
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.id !== this.props.item.id || this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item.id !== this.props.item.id) {
      const { item } = this.props;
      this.setState({
        reload: !this.state.reload,
        oldItem: {
          id: item.id,
          itemName: item.itemName,
          itemType: item.itemType,
          variants: item.variants,
          price: item.price,
          categoryId: item.categoryId,
          categoryTypeId: item.categoryTypeId,
        },
        item: {
          id: item.id,
          itemName: item.itemName,
          itemType: item.itemType,
          variants: item.variants,
          price: item.price,
          categoryId: item.categoryId,
          categoryTypeId: item.categoryTypeId,
        },
      });
    }
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  clear = () => {
    this.setState({
      formError: false,
      item: {
        itemName: "",
        itemType: "SINGLE",
        variants: [],
        price: "",
        categoryId: "",
      },
      variant: {
        variantName: "",
        price: "",
      },
    });
  };

  close = () => {
    this.clear();
    this.props.close();
  };

  nameChangeHandler = (e) => {
    this.setState({
      formError: false,
      item: {
        ...this.state.item,
        itemName: e.target.value,
      },
    });
  };

  typeChangeHandler = (pItemType) => {
    this.setState({
      formError: false,
      item: {
        ...this.state.item,
        itemType: pItemType,
      },
    });
  };

  priceChangeHandler = (e) => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        formError: false,
        item: {
          ...this.state.item,
          price: e.target.value,
        },
      });
    }
  };

  variantNameChangeHandler = (e) => {
    this.setState({
      formError: false,
      variant: {
        ...this.state.variant,
        variantName: e.target.value,
      },
    });
  };

  variantPriceChangeHandler = (e) => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        formError: false,
        variant: {
          ...this.state.variant,
          price: e.target.value,
        },
      });
    }
  };

  categoryChangeHandler = (categoryId) => {
    this.setState({
      formError: false,
      item: {
        ...this.state.item,
        categoryId: categoryId,
      },
    });
  };

  deleteVariant = (pVariant) => {
    let { item } = this.state;
    let variants = item.variants.filter(
      (variant) => variant.variantName !== pVariant.variantName
    );
    item.variants = variants;
    this.setState({
      item: item,
    });
  };

  addVariant = () => {
    const { item, variant } = this.state;
    if (
      variant.variantName === null ||
      variant.variantName === "" ||
      variant.price === null ||
      variant.price === ""
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else {
      let variants = item.variants;
      variants.push(variant);
      this.setState({
        variant: {
          variantName: "",
          price: "",
        },
        items: {
          ...this.state.item,
          variants: variants,
        },
      });
    }
  };

  updateItem = () => {
    const { item, oldItem } = this.state;
    if (
      item.itemName === null ||
      item.itemName === "" ||
      item.price === null ||
      item.price === "" ||
      item.categoryId === null ||
      item.categoryId === ""
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else {
      this.toggleLoading();
      this.close();
      Axios.post(urls.item, item, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.updateItem(response.data.result[0], oldItem);
          }
          this.toggleLoading();
        })
        .catch((msg) => {
          this.toggleLoading();
        });
    }
  };

  render() {
    const { formError, item, variant, loading, error } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Update Item"
        open={open}
        close={this.close}
        save={this.updateItem}
        loading={loading}
      >
        <Form error={formError}>
          <Category
            categoryChangeHandler={this.categoryChangeHandler}
            categoryId={item.categoryId}
          />
          <Form.Field
            control={Input}
            placeholder="Name"
            value={item.itemName}
            onChange={this.nameChangeHandler}
          />
          <Form.Field>
            <ItemTypeLOV
              defaultValue={item.itemType}
              typeChangeHandler={this.typeChangeHandler}
            />
          </Form.Field>

          {item.itemType === "SINGLE" ? (
            <Form.Field>
              <Input
                value={item.price}
                placeholder="Price"
                onChange={this.priceChangeHandler}
              />
            </Form.Field>
          ) : (
            <Segment inverted color="grey">
              {item.variants.length > 0
                ? item.variants.map((variant) => (
                    <Table compact>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell collapsing>
                            <Button
                              circular
                              icon="delete"
                              size="mini"
                              onClick={() => this.deleteVariant(variant)}
                            />
                          </Table.Cell>
                          <Table.Cell>{variant.variantName}</Table.Cell>
                          <Table.Cell textAlign="right">
                            {variant.price} /-
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  ))
                : ""}
              <Segment>
                <Form.Field
                  control={Input}
                  placeholder="Variant Name"
                  value={variant.variantName}
                  onChange={this.variantNameChangeHandler}
                />
                <Form.Field>
                  <Input
                    value={variant.price}
                    placeholder="Price"
                    onChange={this.variantPriceChangeHandler}
                  />
                </Form.Field>
                <Button color="linkedin" fluid onClick={this.addVariant}>
                  Add
                </Button>
              </Segment>
            </Segment>
          )}
          <Message error content={error} />
        </Form>
      </AppModal>
    );
  }
}

export default UpdateItem;
