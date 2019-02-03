import React from "react";
import { func, object } from "prop-types";
import { fetchRequest } from "api/fetchRequest";
import { Result } from "components/Result";
import {
  ResultsAvailable,
  ResultsWrapper,
  ResultWrapper,
  PaginationText,
  PaginationButton,
  Pagination,
  Block
} from "./styles";

export class Results extends React.Component {
  state = {
    metadata: {},
    data: [],
    isLoading: true
  };

  componentDidMount() {
    const { data } = this.props;
    this.getFilteredVehicles(data);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.setState({ isLoading: true }, () => this.getFilteredVehicles(data));
    }
  }

  getFilteredVehicles = vehicleData =>
    fetchRequest({
      url: "web/vehicles",
      method: "POST",
      body: vehicleData
    }).then(({ metadata, data }) =>
      this.setState({ metadata, data, isLoading: false })
    );

  render() {
    const { onPageChange } = this.props;
    const {
      data,
      metadata: { total_count, per_page, page },
      isLoading
    } = this.state;

    const totalPages = Math.ceil(total_count / per_page);

    return (
      <ResultsWrapper>
        <Block>
          <ResultsAvailable>
            {isLoading
              ? "Searching for cars..."
              : total_count === 0
              ? "No cars available"
              : total_count === 1
              ? `${total_count} car available`
              : `${total_count} cars available`}
          </ResultsAvailable>
        </Block>

        <Block>
          <ResultWrapper isLoading={isLoading}>
            {data.map(
              (
                {
                  stock_image,
                  year,
                  vehicle_make,
                  vehicle_model,
                  engine_size_information
                },
                index
              ) => (
                <Result
                  stock_image={stock_image}
                  vehicle_make={vehicle_make}
                  vehicle_model={vehicle_model}
                  engine_size_information={engine_size_information}
                  year={year}
                  key={index}
                />
              )
            )}
          </ResultWrapper>
        </Block>

        {!isLoading && totalPages > 1 && (
          <Block>
            <Pagination>
              <PaginationText>
                Viewing page {page} of {totalPages}
              </PaginationText>
              <PaginationButton
                type="button"
                onClick={() => onPageChange("prev")}
                value="Previous"
                disabled={page === 1}
              />
              <PaginationButton
                type="button"
                onClick={() => onPageChange("next")}
                value="Next"
                disabled={page === totalPages}
              />
            </Pagination>
          </Block>
        )}
      </ResultsWrapper>
    );
  }
}

Results.propTypes = {
  data: object,
  onPageChange: func
};
