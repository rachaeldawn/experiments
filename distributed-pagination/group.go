package distributed

import (
	"math"
	"math/rand"
)

// Group ...
type Group struct {
	Skip  int
	Limit int
	Order int
	IDs   []int
}

// Map ...
type Map map[string]*Group

// Populate fills all groups with ids based on their size
func (grp Map) Populate() Map {
	allIds := make(map[int]bool)
	for _, v := range grp {
		ids := make(map[int]bool)
		for len(ids) < len(v.IDs) {
			val := rand.Intn(10000)
			_, allHas := allIds[val]
			_, idsHas := ids[val]

			if allHas || idsHas {
				continue
			}

			allIds[val] = true
			ids[val] = true
		}

		lastAssigned := 0
		for k := range ids {
			v.IDs[lastAssigned] = k
			lastAssigned++
		}
	}

	return grp
}

// ResetRanges resets the skip and limit to 0 in case something has changed them
func (grp Map) ResetRanges() Map {
	for _, g := range grp {
		g.Skip, g.Limit = 0, 0
	}

	return grp
}

// FillRanges takes page information and populates all groups with the per-page skip and limit
// numbers for use in properly paginated groupings
func (grp Map) FillRanges(page, size int) Map {

	// Create a sorted list of the groups based on ascending order
	groupCount := len(grp)
	groups := make([]*Group, 0)
	for _, g := range grp {
		groups = append(groups, g)
	}

	for index := range groups {
		endIndex := groupCount - index - 1
		for i := 0; i < endIndex; i++ {
			a, b := groups[i], groups[i+1]
			if a.Order > b.Order {
				groups[i], groups[i+1] = groups[i+1], groups[i]
			}
		}
	}

	// page-specific details
	startIndex := page * size
	endIndex := startIndex + size

	// how many ids have been scanned
	offset := 0
	// how much is "left" that we can grab
	poolSize := size

	for _, v := range groups {

		// 0-33
		groupLen := len(v.IDs)
		// start, end are the "start index" and "end index" of this group range
		// eg: Offset 20, len 33: 20 -> 53
		groupStart, groupEnd := offset, offset+groupLen

		// is the group in range? If not, just set to zeroes and move on
		if groupStart > endIndex || groupEnd <= startIndex {
			offset += len(v.IDs)
			v.Skip, v.Limit = 0, 0
			continue
		}

		// Define the inner-most boundaries of the group, where the left-most bound is the
		// largest number out of the group's start or the page's start, and the right bound is the
		// smallest number out of the group's end or the page's end
		rightBound := int(math.Min(float64(groupEnd), float64(endIndex)))
		leftBound := int(math.Max(float64(groupStart), float64(startIndex)))

		// Skip is a no-transform number matching the "start" of the valid boundary
		if v.Skip = startIndex - groupStart; v.Skip < 0 {
			v.Skip = 0
		}

		// Limit is the maximum size from the left boundary to the right boundary
		if v.Limit = rightBound - leftBound; v.Limit > poolSize {
			v.Limit = poolSize
		}

		// Inform the next group so they know where their boundary starts
		offset += len(v.IDs)

		// Draw from the pool based on how much we took
		poolSize -= v.Limit
	}

	return grp
}
