import {
  GetAllEventsRatingMapped,
  GetAllEventsRatingResponse,
} from '../../models/rating.model';

export const mappingRating = (result: GetAllEventsRatingResponse[]) =>
  result.reduce((acc, curr) => {
    const valueToNumber = Number(curr.value);
    const findIdEventIndex = acc.findIndex(
      (el) => el.id_event === curr.id_event
    );
    if (findIdEventIndex === -1) {
      const valueToPush = [valueToNumber];
      acc.push({
        ...curr,
        ratings: valueToPush,
        average: calculateAverage(valueToPush),
      });
    } else {
      acc[findIdEventIndex].ratings.push(valueToNumber);
      acc[findIdEventIndex].average = calculateAverage(
        acc[findIdEventIndex].ratings
      );
    }

    return acc;
  }, [] as GetAllEventsRatingMapped[]);

const calculateAverage = (values: number[]) => {
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return sum / values.length;
};
