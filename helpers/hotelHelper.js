const { default: axios } = require("axios");
const Helper = require('../helpers/helper');
const soap = require('soap');
require('dotenv').config();
const fs = require('fs');

let actionURL = "http://webservices.amadeus.com/Hotel_MultiSingleAvailability_10.0";
let addressingURL = "https://nodeD3.test.webservices.amadeus.com/1ASIWAMAAGNU";

function buildSoapRequest({ messageID, userId, encodedNonce, passSHA, timestamp, dutyCode, offerId, requestedCurrency, location, checkinDate, checkoutDate, totalRoom, adults, children, childrenAge }) {
  let childrenSoap = '';

  // Check if there are children and their ages are provided
  if (children.length > 0 && childrenAge.length > 0) {
    for (let i = 0; i < childrenAge.length; i++) { // Use < not <= to avoid extra iteration
      const age = childrenAge[i];
      if (age) { // Ensure there's a valid age value
        childrenSoap += `<GuestCount AgeQualifyingCode="8" Count="1" Age="${age}" />`;
      }
    }
  }

  return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
    <soap:Header>
          <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">${messageID}</add:MessageID>
          <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">${actionURL}</add:Action>
          <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${addressingURL}</add:To>
          <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1" />
          <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
              <oas:Username>${userId}</oas:Username>
              <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${encodedNonce}</oas:Nonce>
              <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${passSHA}</oas:Password>
              <oas1:Created>${timestamp}</oas1:Created>
            </oas:UsernameToken>
          </oas:Security>
          <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
            <UserID AgentDutyCode="${dutyCode}" POS_Type="1" PseudoCityCode="${offerId}" RequestorType="U" />
          </AMA_SecurityHostedUser>
    </soap:Header>
    <soap:Body>

    <OTA_HotelAvailRQ EchoToken="MultiSingle" Version="4.000" PrimaryLangID="EN" RateDetailsInd="true" SummaryOnly="true" AvailRatesOnly="true" RateRangeOnly="true" ExactMatchOnly="false" ${requestedCurrency} SearchCacheLevel="VeryRecent" MaxResponses="60">
      <AvailRequestSegments >
        <AvailRequestSegment InfoSource="MultiSource" >
          <HotelSearchCriteria BestOnlyIndicator="true">
            <Criterion ExactMatch="true">
              <HotelRef HotelCityCode="${location}"/>
              <StayDateRange Start="${checkinDate}" End="${checkoutDate}" />
              <RoomStayCandidates>
                    <RoomStayCandidate RoomID="1" Quantity="${totalRoom}">
                      <GuestCounts IsPerRoom="true">
                        <GuestCount AgeQualifyingCode="10" Count="${adults}" />
                        ${childrenSoap}
                      </GuestCounts>
                    </RoomStayCandidate>
                  </RoomStayCandidates>
            </Criterion>
          </HotelSearchCriteria>
        </AvailRequestSegment>
      </AvailRequestSegments>
    </OTA_HotelAvailRQ>
    </soap:Body>
    </soap:Envelope>`;
}
exports.getHotelDetails = async (params) => {
  //let start_lat, start_lon, end_lat, end_lon, departure_date;
  let result = {
    location: params.location,
    checkinDate: params.checkin_date,
    checkoutDate: params.checkout_date,
    totalRoom: params.total_room,
    adults: params.adult,
    children: params.children,
    childrenAge: params.children_age,
    requestedCurrency: 'RequestedCurrency="GBP"'
  };
  let data = Helper.getAmadeusheader();
  const soapParams = { ...result, ...data };
  const soapRequest = buildSoapRequest(soapParams);
  return soapParams;
  const wsdl = "./1ASIWAMAAGN_PDT_HotelAvailability_2.0_4.0.wsdl";
  const options = {
    endpoint: addressingURL,
    forceSoap12Headers:true
  }

  try {

    soap.createClient(wsdl, options, (err, client) => {
      if (err) {
        console.error('Failed to create SOAP client:', err);
        return;
      }
      //return "";
      console.log("SOAP client created");
      client.Hotel_MultiSingleAvailabilityAsync(soapRequest, function(err, result) {
        if (err) {
          console.error('Error calling Hotel MultiSingleAvailability:', err);
          return;
        }
    
        // Process the result
        console.log('Hotel availability response:', result);
      });
    });
  } catch (error) {
    return error;
  }

}