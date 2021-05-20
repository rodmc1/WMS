export const getWarehouseDetails = (props) => {
  let warehouseDetails = [
    ['warehouseName', props.warehouse_client],
    ['warehouseType', props.warehouse_type],
    ['nearbyStation', props.nearby_station],
    ['warehouseStatus', props.warehouse_status],
    ['yearOfTop', props.year_top],
    ['minLeaseTerms', props.min_lease_terms],
    ['psf', props.psf],
    ['floorArea', props.floor_area],
    ['coveredArea', props.covered_area],
    ['mezzanineArea', props.mezzanine_area],
    ['openArea', props.open_area],
    ['officeArea', props.office_area],
    ['batteryChargingArea', props.battery_charging_area],
    ['loadingUnloadingBays', props.loading_unloading_bays],
    ['remarks', props.remarks]
  ];
  
  props.warehouse_users_details.forEach(user => {
    if (user.role === 'Broker') {
      warehouseDetails = [...warehouseDetails,
        ["companyBrokerFirstName", user.first_name],
        ["companyBrokerMiddleName", user.middle_name],
        ["companyBrokerLastName", user.last_name],
        ["companyBrokerEmailAddress", user.email_address],
        ["companyBrokerMobileNumber", user.mobile_number]
      ]
    } else {
      warehouseDetails = [...warehouseDetails,
        ["contactPersonFirstName", user.first_name],
        ["contactPersonMiddleName", user.middle_name],
        ["contactPersonLastName", user.last_name],
        ["contactPersonEmailAddress", user.email_address],
        ["contactPersonMobileNumber", user.mobile_number]
      ]
    }
  });

  return warehouseDetails;
} 
