export interface TrackingHistoryItem {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface TrackingDetails {
  tracking_provider: string;
  tracking_number: string;
  tracking_status: 'outbound' | 'in_transit' | 'out_for_delivery' | 'delivered';
  tracking_history: TrackingHistoryItem[];
}

export async function getTrackingDetails(
  carrier: string,
  trackingNumber: string
): Promise<TrackingDetails> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanCarrier = carrier.toLowerCase();
  const providerName = 
    cleanCarrier.includes('shiprocket') ? 'Shiprocket' :
    cleanCarrier.includes('delhivery') ? 'Delhivery Logistics' :
    cleanCarrier.includes('bluedart') ? 'BlueDart Express' : 'India Post';

  // Determine mock status based on the tracking number suffix or content
  let status: 'outbound' | 'in_transit' | 'out_for_delivery' | 'delivered' = 'in_transit';
  let history: TrackingHistoryItem[] = [];

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

  if (trackingNumber.endsWith('123') || trackingNumber.toLowerCase().includes('outbound')) {
    status = 'outbound';
    history = [
      {
        status: 'Outbound',
        description: 'Package has been packaged and is ready for pickup.',
        location: 'Warehouse Facility, Mumbai',
        timestamp: oneDayAgo.toISOString(),
      }
    ];
  } else if (trackingNumber.endsWith('789') || trackingNumber.toLowerCase().includes('delivered')) {
    status = 'delivered';
    history = [
      {
        status: 'Delivered',
        description: 'Shipment has been delivered and signed by customer.',
        location: 'Customer Address, New Delhi',
        timestamp: now.toISOString(),
      },
      {
        status: 'Out for Delivery',
        description: 'Courier agent has picked up parcel for local delivery.',
        location: 'Sorting Hub, Okhla, New Delhi',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: 'In Transit',
        description: 'Parcel is in transit between shipping hubs.',
        location: 'Central Transit Center, Ahmedabad',
        timestamp: oneDayAgo.toISOString(),
      },
      {
        status: 'Outbound',
        description: 'Package processed at Mumbai terminal.',
        location: 'Warehouse Facility, Mumbai',
        timestamp: twoDaysAgo.toISOString(),
      }
    ];
  } else if (trackingNumber.endsWith('456') || trackingNumber.toLowerCase().includes('delivery')) {
    status = 'out_for_delivery';
    history = [
      {
        status: 'Out for Delivery',
        description: 'Package is out for delivery with courier personnel.',
        location: 'Local Delivery Center, New Delhi',
        timestamp: now.toISOString(),
      },
      {
        status: 'In Transit',
        description: 'Package arrived at regional sorting center.',
        location: 'Central Distribution Hub, Delhi',
        timestamp: oneDayAgo.toISOString(),
      },
      {
        status: 'Outbound',
        description: 'Package dispatched from sender facility.',
        location: 'Warehouse Facility, Mumbai',
        timestamp: twoDaysAgo.toISOString(),
      }
    ];
  } else {
    // Default transit status
    status = 'in_transit';
    history = [
      {
        status: 'In Transit',
        description: 'Shipment is currently in transit to sorting facility.',
        location: 'Transit Terminal, Surat',
        timestamp: now.toISOString(),
      },
      {
        status: 'Outbound',
        description: 'Package generated and picked up by courier.',
        location: 'Warehouse Facility, Mumbai',
        timestamp: oneDayAgo.toISOString(),
      }
    ];
  }

  return {
    tracking_provider: providerName,
    tracking_number: trackingNumber,
    tracking_status: status,
    tracking_history: history,
  };
}
